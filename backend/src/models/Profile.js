import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    email: String,
    phone: String,
    location: String,
    bio: String,
    joined: String,
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
