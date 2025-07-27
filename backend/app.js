const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error.js");
const dotenv = require("dotenv");

// Load config first
dotenv.config({ path: "backend/config/config.env" });

// ✅ CORS setup for frontend <-> backend cookie sharing
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-name.vercel.app" // replace with your real frontend domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// ✅ Stripe API route MUST be before error handler
app.get("/stripeapikey", (req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

// ✅ Routes
const product = require("./Routes/productRoute.js");
const user = require("./Routes/userRoute.js");
const order = require("./Routes/orderRoute.js");
const payment = require("./Routes/paymentRoute.js");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// ✅ Error middleware (last)
app.use(errorMiddleware);

module.exports = app;
