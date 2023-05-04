const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    cover: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
    },
    summary: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 50000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

export default PostModel;
