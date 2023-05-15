import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { bucket } from "../Firebase/Firebase";
import User from "../Model/UserModel";
dotenv.config();

const upload = multer({ dest: "uploads/" });
const Registration = express.Router();
const salt = bcrypt.genSalt(10);
const defaultImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/primetech-e8527.appspot.com/o/Deafult%2Fprofile.png?alt=media&token=01ef3106-a0d2-4443-9371-71ec40e241dd";

Registration.post("/registration", async (req, res) => {
  const { Name, Email, Bio, Password } = req.body;
  const socialLinks = {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
    telegram: "",
    website: "",
  };

  const Image = defaultImageUrl;

  try {
    const UserData = await User.create({
      Name,
      Email,
      Password: bcrypt.hashSync(Password, await salt),
      Bio,
      Image,
      socialLinks,
    });
    res.json({ UserData });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

Registration.put(
  "/updateprofile/:userId",
  upload.single("Image"),
  async (req, res) => {
    let newName: string;

    if (req.file) {
      // check if there is a new image in the request
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newName = `${Date.now()}.${ext}`;

      const file = bucket.file(`profile/${newName}`);
      const writeStream = file.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      fs.createReadStream(path).pipe(writeStream);
      await new Promise((resolve, reject) => {
        writeStream.on("error", reject);
        writeStream.on("finish", resolve);
      });
      await file.makePublic();

      // delete temporary file from local storage
      fs.unlinkSync(path);
    }

    const { token } = req.cookies;

    jwt.verify(
      token!,
      process.env.SECRET!,
      async (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) throw err;

        const userId = req.params.userId;
        const { Name, Bio, Social } = req.body;

        const decodedToken =
          typeof decoded === "string" ? JSON.parse(decoded) : decoded;
        const info = decodedToken.id;

        try {
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          const isAuthor = JSON.stringify(user._id) === JSON.stringify(info);

          if (!isAuthor) {
            return res.status(400).json("You are not the author of this post");
          }
          // delete previous image if it's not the default image
          if (user.Image && user.Image !== defaultImageUrl) {
            const previousImageName = user.Image.split("/").pop();
            const previousImageFile = bucket.file(
              `profile/${previousImageName}`
            );

            const exists = await previousImageFile.exists();
            if (exists) {
              await previousImageFile.delete();
            }
          }

          // update user data
          user.Name = Name || user.Name;
          user.Bio = Bio || user.Bio;
          user.socialLinks = Social ? JSON.parse(Social) : user.socialLinks;
          user.Image = newName
            ? `https://storage.googleapis.com/${bucket.name}/profile/${newName}`
            : user.Image;

          const updatedUser = await user.save();
          res.json(updatedUser);
        } catch (error) {
          console.log(error);
          console.log(decodedToken);
          res.status(400).json(error);
        }
      }
    );
  }
);

export default Registration;
