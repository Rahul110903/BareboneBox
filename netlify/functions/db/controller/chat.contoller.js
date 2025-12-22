import { asyncHandler } from "../utils/asyncHandler";
import { Conversation } from "../models/conversation.js";
import { ApiError } from "../utils/ApiError.js";

const saveConversation = asyncHandler(async (dataToStore) => {
  if (!dataToStore.from || !dataToStore.messageId) {
    throw new ApiError(400, "Missing required fields: from and messageId");
  }

  const conversation = await Conversation.create(dataToStore);

  if (!conversation) {
    throw new ApiError(500, "Failed to save conversation to database");
  }

  return conversation;
});

export { saveConversation };
