import { asyncHandler } from "../utils/asyncHandler";
import { ConversationThread } from "../models/conversationThread.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const saveConversation = asyncHandler(async (dataToStore) => {
  if (!dataToStore.from) {
    throw new ApiError(400, "Missing required field: from");
  }

  const conversationItem = {
    type: dataToStore.type || "",
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

  // Set top-level fields on insert (if provided)
  if (dataToStore.display_phone_number)
    update.$setOnInsert.display_phone_number = dataToStore.display_phone_number;
  if (dataToStore.phone_number_id)
    update.$setOnInsert.phone_number_id = dataToStore.phone_number_id;
  if (dataToStore.profile_name)
    update.$setOnInsert.profile_name = dataToStore.profile_name;
  if (dataToStore.type) update.$setOnInsert.type = dataToStore.type;

  // If messageId provided, prevent duplicate by ensuring no existing item with same message_id
  if (dataToStore.messageId) {
    filter["conversations.message_id"] = { $ne: dataToStore.messageId };
  }

  // Push the conversation item
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
