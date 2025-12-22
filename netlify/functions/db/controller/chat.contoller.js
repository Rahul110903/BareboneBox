import { asyncHandler } from "../utils/asyncHandler";
import { ConversationThread } from "../models/conversationThread.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const saveConversation = asyncHandler(async (dataToStore) => {
  if (!dataToStore.from) {
    throw new ApiError(400, "Missing required field: from");
  }

  const conversationItem = {
    userText: dataToStore.conversation_user || "",
    botText: dataToStore.conversation_bot || "",
    timestamp: dataToStore.timestamp || new Date(),
  };

  // Build update filter and update payload
  const filter = { from: dataToStore.from };
  const update = {
    $setOnInsert: { from: dataToStore.from },
    $set: {},
  };

  // Set top-level type on insert (if provided)
  if (dataToStore.type) update.$setOnInsert.type = dataToStore.type;

  // Push the conversation item (no need to dedupe by messageId since we store only userText/botText/timestamp)
  update.$push = { conversations: conversationItem };

  const updateResult = await ConversationThread.updateOne(filter, update, {
    upsert: true,
  });

  // Fetch the thread to return
  const thread = await ConversationThread.findOne({
    from: dataToStore.from,
  }).lean();

  if (!thread) {
    throw new ApiError(500, "Failed to save conversation to database");
  }

  // Normalize _id to string and convert dates to ISO strings for consistent JSON format
  if (thread._id) thread._id = String(thread._id);

  if (Array.isArray(thread.conversations)) {
    thread.conversations = thread.conversations.map((c) => ({
      userText: c.userText || "",
      botText: c.botText || "",
      timestamp: c.timestamp ? new Date(c.timestamp).toISOString() : null,
    }));
  }

  if (thread.createdAt)
    thread.createdAt = new Date(thread.createdAt).toISOString();
  if (thread.updatedAt)
    thread.updatedAt = new Date(thread.updatedAt).toISOString();

  new ApiResponse(201, thread, "Conversation saved successfully");

  return thread;
});

export { saveConversation };
