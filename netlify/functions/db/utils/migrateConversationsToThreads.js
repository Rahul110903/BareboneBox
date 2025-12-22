import mongoose from "mongoose";
import { connectDB } from "../index.js";
import { Conversation } from "../models/conversation.js";
import { ConversationThread } from "../models/conversationThread.js";

const migrate = async () => {
  try {
    await connectDB();
    console.log("Connected to DB for migration");

    const docs = await Conversation.find({}).lean();
    console.log(`Found ${docs.length} legacy conversation docs`);

    for (const doc of docs) {
      const item = {
        messageId: doc.messageId,
        userText: doc.conversation_user || "",
        botText: doc.conversation_bot || "",
        type: doc.type || "text",
        timestamp: doc.timestamp || new Date(),
      };

      await ConversationThread.updateOne(
        { from: doc.from, "conversations.messageId": { $ne: item.messageId } },
        { $push: { conversations: item }, $setOnInsert: { from: doc.from } },
        { upsert: true }
      );
    }

    console.log("Migration complete");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
