const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// CORS thủ công
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// run server
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});