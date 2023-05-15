import express, { Request, Response, Router } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { bucket } from "../Firebase/Firebase";
import Post from "../Model/PostModel";

const SinglePost: Router = express.Router();
const upload = multer({ dest: "uploads/" });

// CREATE A NEW POST

SinglePost.post(
  "/newpost",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { originalname, path } = req.file!;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newName = `${Date.now()}.${ext}`;

    // upload file to Firebase Storage

    const file = bucket.file(`post/${newName}`);
    const writeStream = file.createWriteStream({
      metadata: { contentType: req.file!.mimetype },
    });
    fs.createReadStream(path).pipe(writeStream);
    await new Promise<void>((resolve, reject) => {
      writeStream.on("error", reject);
      writeStream.on("finish", resolve);
    });
    await file.makePublic();

    // delete temporary file from local storage
    fs.unlinkSync(path);

    const { token } = req.cookies;
    jwt.verify(
      token!,
      process.env.SECRET!,
      {},
      async (error: any, info: any) => {
        if (error) throw error;

        const { title, summary, content, categories } = req.body;

        const PostData = await Post.create({
          title,
          summary,
          categories,
          content,
          cover: `https://storage.googleapis.com/${bucket.name}/post/${newName}`,
          author: info.id,
        });
        res.json(PostData);
      }
    );
  }
);

// UPDATE THE SINGLE POST

SinglePost.put("/post", upload.single("file"), async (req, res) => {
  let newPath: fs.PathLike | null = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = (originalname as string).split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token!, process.env.SECRET!, {}, async (error: any, info: any) => {
    if (error) throw error;

    const { id, title, summary, content, categories } = req.body;
    const post = await Post.findById(id);

    const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json("You are not the author of this post");
    }

    // If a new file was uploaded, upload it to Firebase Storage
    let coverUrl = post.cover;
    if (newPath) {
      const fileName = `${Date.now()}.${(newPath as string).split(".").pop()}`;
      const file = bucket.file(`post/${fileName}`);
      const writeStream = file.createWriteStream({
        metadata: { contentType: req.file?.mimetype },
      });
      fs.createReadStream(newPath).pipe(writeStream);
      await new Promise((resolve, reject) => {
        writeStream.on("error", reject);
        writeStream.on("finish", resolve);
      });
      await file.makePublic();
      coverUrl = `https://storage.googleapis.com/${bucket.name}/post/${fileName}`;

      // delete temporary file from local storage
      fs.unlinkSync(newPath);

      // delete previous cover image from Firebase Storage
      if (post.cover) {
        const oldFileName = post.cover.split("/").pop();
        const oldFile = bucket.file(`post/${oldFileName}`);
        await oldFile.delete();
      }
    }

    await post.updateOne({
      title,
      summary,
      categories,
      content,
      cover: coverUrl,
    });

    res.json(post);
  });
});

// DELETE A POST
SinglePost.delete("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the image from Firebase Storage
    const fileName = post.cover.split("/").pop(); // get the file name from the image URL
    const file = bucket.file(`post/${fileName}`);
    await file.delete();

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not delete post" });
  }
});

export default SinglePost;
