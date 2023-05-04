import express from "express";
import CommentModel from "../Model/CommentModel";

const Comment = express.Router();

// CREATE A COMMENT
Comment.post("/posts/:postId/comments", async (req, res) => {
  const { author, post, content } = req.body;

  try {
    const comment = await CommentModel.create({ author, post, content });

    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL COMMENTS FOR A POST
Comment.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await CommentModel.find({ post: postId })
      .populate("author")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE A COMMENT
Comment.patch("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await CommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE A COMMENT
Comment.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await CommentModel.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default Comment;
