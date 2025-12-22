import mongoose from "mongoose";

const conversationItemSchema = new mongoose.Schema(
  {
    userText: { type: String, default: "" },
    botText: { type: String, default: "" },
    type: { type: String, default: "text" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationThreadSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, index: true },
    conversations: { type: [conversationItemSchema], default: [] },
  },
  { timestamps: true }
);

export const ConversationThread = mongoose.model(
  "ConversationUser",
  conversationThreadSchema
);
