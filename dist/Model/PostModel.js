"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, model = mongoose.model;
var PostSchema = new Schema({
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
}, {
    timestamps: true,
});
var PostModel = model("Post", PostSchema);
exports.default = PostModel;
