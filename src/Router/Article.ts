import express, { Request, Response, Router } from "express";
import Post from "../Model/PostModel";

const Article: Router = express.Router();

// RENDER ALL POST
Article.get("/post", async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const count = await Post.countDocuments();
    const totalPages = Math.ceil(count / Number(pageSize));
    const posts = await Post.find()
      .populate("author", ["Name"])
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

    res.json({ posts, totalPages });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// RENDER ALL POST OF A SINGLE USER
Article.get("/post/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const count = await Post.countDocuments({ author: id });
    const totalPages = Math.ceil(count / Number(pageSize));
    const posts = await Post.find({ author: id })
      .populate("author", ["Name"])
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

    res.json({ posts, totalPages });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// RENDER A SINGLE POST
Article.get("/post/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const PostData = await Post.findById(id).populate("author", [
    "Name",
    "Email",
    "Bio",
  ]);

  res.json(PostData);
});

// RENDER THE FEATURED POST
Article.get("/posts/featured", async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ categories: "featured" })
      .populate("author", ["Name"])
      .sort({ updatedAt: -1 });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// RENDER ALL HOT POST
Article.get("/posts/hotpost", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ categories: "hotpost" })
      .populate("author", ["Name"])
      .sort({ updatedAt: -1 })
      .limit(3);
    if (posts.length === 0) {
      return res.status(404).json({ message: "No Post To Display" });
    }
    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// RENDER ALL POST OF A SINGLE CATEGORIES
Article.get(
  "/categoriesposts/:category",
  async (req: Request, res: Response) => {
    const { page = 1, pageSize = 10 } = req.query;
    const { category } = req.params;

    try {
      const count = await Post.countDocuments({ categories: category });
      const totalPages = Math.ceil(count / Number(pageSize));
      const posts = await Post.find({ categories: category })
        .populate("author", ["Name"])
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(pageSize))
        .limit(Number(pageSize));

      res.json({ posts, totalPages });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default Article
