"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    Name: { type: String, required: true },
    Email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                // Regular expression for email validation
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(email);
            },
            message: function (props) { return "".concat(props.value, " is not a valid email address"); },
        },
    },
    Image: { type: String },
    Bio: { type: String, maxlength: 200 },
    Password: { type: String, minlength: 6 },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        github: { type: String },
        telegram: { type: String },
        website: { type: String },
    },
});
var UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;
