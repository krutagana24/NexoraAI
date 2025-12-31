import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "unknown",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Code || mongoose.model("Code", CodeSchema);
