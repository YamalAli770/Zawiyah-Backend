const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// ! Register User

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, accountType } = req.body;
  if (!username || !email || !password || !accountType) {
    res.status(400);
    throw new Error("Provide All Required Fields");
  }

  const userExists =
    (await User.findOne({ email: req.body.email })) ||
    (await User.findOne({ username: req.body.username }));

  if (userExists) {
    res.status(409);
    throw new Error("User Already Exists");
  }

  if (validator.isEmail(email) && validator.isStrongPassword(password)) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      ...req.body,
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    if (newUser) {
      res.status(201).json(newUser);
    }
  }
  res.status(400);
  throw new Error("Registeration Unsuccessful");
});

// ! Login User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Provide All Required Fields");
  }

  const userExists = await User.findOne({ email: req.body.email });

  if (!userExists) {
    res.status(400);
    throw new Error("Cannot Find User With The Provided Email");
  }

  // if(userExists.activeSessionToken) {
  //   const invalidatedUser = await invalidateSession(userExists.activeSessionToken);

  //   if(!invalidatedUser) {
  //     res.status(400);
  //     throw new Error("Error while invalidating session.");
  //   }
  // }

  const comparePassword = await bcrypt.compare(
    req.body.password,
    userExists.password
  );
  if (!comparePassword) {
    res.status(400);
    throw new Error("Wrong Password");
  } else {
    // Creating JWTS
    const accessToken = jwt.sign(
      {
        userDetails: {
          id: userExists._id,
          username: userExists.username,
          accountType: userExists.accountType,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      {
        id: userExists._id,
        username: userExists.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Storing Refresh Token In D
    userExists.refreshToken = refreshToken;
    // userExists.activeSessionToken = refreshToken;
    const result = await userExists.save();

    const { password, ...other } = userExists._doc;

    // Create user cart if not exists
    const cartExists = await Cart.findOne({ cartOwner: userExists._id });

    if (userExists.accountType === "buyer" || userExists.accountType === "Buyer" && !cartExists) {
      const newCart = await Cart.create({ cartOwner: userExists._id });
    };

    // HTTP Cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ ...other, accessToken });
  }
});

// ! Logout User

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  // Is refresh token in DB
  const userExists = await User.findOne({ refreshToken: refreshToken });
  if (!userExists) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  // const invalidatedUser = await invalidateSession(refreshToken);

  // if (!invalidatedUser) {
  //   res.status(400);
  //   throw new Error("Error while invalidating session.");
  // }
  
  // Delete Refresh Token From DB
  const updatedUser = await userExists.updateOne({
    $set: { refreshToken: "" },
  });
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true }); // secure-true
  return res.sendStatus(204);
});


// ! Refresh Access Token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.jwt;
  console.log(refreshToken);

  if(!refreshToken) {
    res.status(401);
    throw new Error("Refresh Token Not Found");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded.id);

    // Check if the user exists and has the same activeSessionToken
  if (!user || user.refreshToken !== refreshToken) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  // Generate a new access token
  const accessToken = jwt.sign(
    {
      userDetails: {
      id: user._id,
      username: user.username,
      accountType: user.accountType,
    },
    },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    console.log("Access Token:", accessToken);
    // Return the new access token
    res.status(200).json({ accessToken });
});

// ! Get User Details

const getMe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("Cannot Find User Without Valid Credentials");
  }
  User.verifyId(id, req, res);

  const user = await User.findById(id);
  
  if (user) {
    const { password, refreshToken, ...others } = user._doc;
    res.status(200).json(others);
  } else {
    res.status(404);
    throw new Error("User Does Not Exist");
  }
});

// ! Get All Users

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// const invalidateSession = asyncHandler(async (token) => {
//   const user = await User.findOneAndUpdate(
//     { activeSessionToken: token },
//     { $set: { activeSessionToken: "", refreshToken: "" } },
//     { new: true }
//   );

//   if (!user) {
//     return null;
//   }

//   return user;
// });


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
