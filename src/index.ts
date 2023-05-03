import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
const port = process.env.PORT;
const allowedOrigin = process.env.ORIGIN;

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin,
  credentials: true,
};

// Add a CORS middleware to the app
app.use(cors(corsOptions));

// Define your endpoints
app.get("/hello", (req, res) => {
  res.status(200).json("Hey Sejar parvez");
});

app.get("/bye", (req, res) => {
  res.status(200).json("Goodbye");
});

app.listen(port, () => {
  console.log(`⚡ Server is listening on port ${port}`);
});
