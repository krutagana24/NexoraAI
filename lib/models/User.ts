import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Not required for OAuth users
  },
  image: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["credentials", "google", "apple"],
    default: "credentials",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
