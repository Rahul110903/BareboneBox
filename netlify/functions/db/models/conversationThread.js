import mongoose from "mongoose";

const messageSubSchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true },
    conversation_user: { type: String, default: "" },
    conversation_bot: { type: String, default: "" },
    type: { type: String, default: "text" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationThreadSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, index: true },
    messages: { type: [messageSubSchema], default: [] },
  },
  { timestamps: true }
);

export const ConversationThread = mongoose.model(
  "ConversationThread",
  conversationThreadSchema
);
