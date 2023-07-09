require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const port = process.env.PORT;

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const bidRoutes = require('./routes/bidRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fileUpload = require('express-fileupload');

const verifyJWT = require('./middleware/verifyJWT');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


connectDB();

const app = express();

const corsOptions = {
    origin: ['https://zawiyah.netlify.app', 'http://localhost:5173'],
    credentials: true,
}

// Serve static files
app.use('/public/uploads', express.static('public/uploads'));

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bid' , bidRoutes)
app.use('/api/cart' , cartRoutes)
app.use('/api/order', orderRoutes);

app.post("/api/create-checkout-session", verifyJWT, async (req, res) => { 
  const { cartProducts } = req.body; 
  const lineItems = cartProducts.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.currentPrice * 100, // Convert price to cents
    },
    quantity: 1, // Include the quantity property
  }));

  const session = await stripe.checkout.sessions.create({ 
    payment_method_types: ["card"], 
    line_items: lineItems,
    mode: "payment", 
    success_url: "https://zawiyah.netlify.app/success", 
    cancel_url: "https://zawiyah.netlify.app/cancel", 
  }); 
  res.json({ id: session.id }); 
}); 


app.use(errorHandler);

app.listen(port, () => {
    console.log('App listening on port: ' + port);
});
