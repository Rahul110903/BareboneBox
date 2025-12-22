import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    conversation_user: {
      type: String,
      default: "",
    },
    conversation_bot: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
