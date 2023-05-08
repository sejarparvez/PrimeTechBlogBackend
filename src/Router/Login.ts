import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../Model/UserModel";
dotenv.config();
const Login = express.Router();
const Secret = process.env.SECRET;

Login.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const UserData = await User.findOne({ Email: email });

  if (!UserData) {
    res.status(400).json("Wrong Email Password");
    return;
  }

  const passOk =
    UserData.Password && bcrypt.compareSync(password, UserData.Password);
  if (passOk) {
    jwt.sign(
      { email, name: UserData.Name, id: UserData._id },
      `${Secret}`,
      {},
      (error, token) => {
        if (error) throw error;
        res
          .cookie("token", token, {
            sameSite: "none",
            secure: true,
          })
          .json({
            id: UserData.id,
            Name: UserData.Name,
            Email: UserData.Email,
          });
      }
    );
  } else {
    res.status(400).json("Wrong Email Or Password");
  }
});

// ROUTER FOR LOGIN OUT
Login.post("/logout", (req, res) => {
  res.cookie("token", "").json("OK");
});

// ROUTER FOR PROFILE INFORMATION

Login.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token Found" });
    }
    const decoded = jwt.verify(token, `${Secret}`);
    res.json(decoded);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

Login.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const UserData = await User.findById(id);

  res.json(UserData);
});

export default Login;
