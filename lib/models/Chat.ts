import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
