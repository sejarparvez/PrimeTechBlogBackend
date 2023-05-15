import { model, Schema } from "mongoose";

interface User {
  Name: string;
  Email: string;
  Image?: string;
  Bio?: string;
  Password?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    telegram?: string;
    website?: string;
  };
}

const UserSchema = new Schema<User>({
  Name: { type: String, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email: string) {
        // Regular expression for email validation
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid email address`,
    },
  },
  Image: { type: String },
  Bio: { type: String, maxlength: 5000 },
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

const UserModel = model<User>("User", UserSchema);

export default UserModel;
