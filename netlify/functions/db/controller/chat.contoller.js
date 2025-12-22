import { asyncHandler } from "../utils/asyncHandler";
import { ConversationThread } from "../models/conversationThread.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const saveConversation = asyncHandler(async (dataToStore) => {
  if (!dataToStore.from || !dataToStore.messageId) {
    throw new ApiError(400, "Missing required fields: from and messageId");
  }

  const messageObj = {
    messageId: dataToStore.messageId,
    conversation_user: dataToStore.conversation_user || "",
    conversation_bot: dataToStore.conversation_bot || "",
    type: dataToStore.type || "text",
    timestamp: dataToStore.timestamp || new Date(),
  };

  // Push message into messages array only if messageId doesn't already exist
  const updateResult = await ConversationThread.updateOne(
    {
      from: dataToStore.from,
      "messages.messageId": { $ne: dataToStore.messageId },
    },
    {
      $push: { messages: messageObj },
      $setOnInsert: { from: dataToStore.from },
    },
    { upsert: true }
  );

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
