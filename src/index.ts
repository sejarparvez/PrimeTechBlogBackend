import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();
const Port = process.env.PORT;

app.use(cors());

app.get("/hello", (req, res) => {
  res.status(200).json("Hey Sejar parvez");
});

app.listen(Port, () => {
  console.log(`Server is listening on port ${Port}`);
});
