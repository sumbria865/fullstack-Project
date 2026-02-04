import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "MANAGER", "USER"],
    default: "USER",
  },
});

export default mongoose.model("User", userSchema);
