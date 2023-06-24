const asyncHandler = require("express-async-handler");
const User = require("../models/User");

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

  const getUserByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
      res.status(400);
      throw new Error("Cannot Find User Without Valid Credentials");
    }
  
    const user = await User.findOne({ username });
    
    if (user) {
      const { password, refreshToken, ...others } = user._doc;
      res.status(200).json(others);
    } else {
      res.status(404);
      throw new Error("User Does Not Exist");
    }
  });
  
  const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

module.exports = {
    getMe,
    getAllUsers,
    getUserByUsername
};