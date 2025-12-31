import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Email || mongoose.model("Email", EmailSchema);
