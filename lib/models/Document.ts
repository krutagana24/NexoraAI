import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["text", "pdf"],
    default: "text",
  },
  originalText: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
