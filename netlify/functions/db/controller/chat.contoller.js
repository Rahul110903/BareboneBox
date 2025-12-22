import { asyncHandler } from "../utils/asyncHandler";
import { ConversationThread } from "../models/conversationThread.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const saveConversation = asyncHandler(async (dataToStore) => {
  if (!dataToStore.from || !dataToStore.messageId) {
    throw new ApiError(400, "Missing required fields: from and messageId");
  }

  const conversationItem = {
    // keep messageId in item if provided (used for dedupe)
    ...(dataToStore.messageId ? { messageId: dataToStore.messageId } : {}),
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

  // Set top-level message_ig/type on insert (if provided)
  if (dataToStore.message_ig) update.$setOnInsert.message_ig = dataToStore.message_ig;
  if (dataToStore.type) update.$setOnInsert.type = dataToStore.type;

  // If messageId provided, prevent duplicate by ensuring no existing item with same messageId
  if (dataToStore.messageId) {
    filter["conversations.messageId"] = { $ne: dataToStore.messageId };
  }

  // Push the conversation item
  update.$push = { conversations: conversationItem };

  const updateResult = await ConversationThread.updateOne(filter, update, { upsert: true });

  // Fetch the thread to return
  const thread = await ConversationThread.findOne({
    from: dataToStore.from,
  }).lean();

  if (!thread) {
    throw new ApiError(500, "Failed to save conversation to database");
  }

  ApiResponse(201, thread, "Conversation saved successfully");

  return thread;
});

export { saveConversation };
