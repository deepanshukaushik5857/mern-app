const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error.js");
const dotenv = require("dotenv");

// Load config first
// 1. Load env and middleware
dotenv.config({ path: "backend/config/config.env" });

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// ✅ 2. Define this route directly
app.get("/stripeapikey", (req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

// 3. API routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// 4. Error middleware
app.use(errorMiddleware);


module.exports = app;
