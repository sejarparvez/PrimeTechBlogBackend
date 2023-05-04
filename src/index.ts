import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Article from "./Router/Article";
import Comment from "./Router/Comment";
import Login from "./Router/Login";
import Registration from "./Router/Registration";
import SinglePost from "./Router/SinglePost";

dotenv.config();
const app = express();
const port = process.env.PORT;
const allowedOrigin = process.env.ORIGIN;
const MongoDB = process.env.MONGODB;

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin,
  credentials: true,
};

// Add a CORS middleware to the app
app.use(cors(corsOptions));

// Use cookie-parser middleware
app.use(cookieParser());

// DATABASE CONNECTION
async function connectToDatabase() {
  try {
    await mongoose.connect(`${MongoDB}`);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

// Define your endpoints
app.use(Login);
app.use(Registration);
app.use(Comment);
app.use(SinglePost);
app.use(Article);

// DEFINING STATIC FOLDER FOR FILE
app.use("/uploads", express.static(__dirname + "/uploads"));

app.listen(port, () => {
  console.log(`⚡ Server is listening on port ${port}`);
});
