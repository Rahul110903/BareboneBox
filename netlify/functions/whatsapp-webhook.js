// Netlify Function to handle Meta WhatsApp Webhook verification and events
// Deploy this to Netlify and set the webhook URL to:
// https://<your-site>.netlify.app/.netlify/functions/whatsapp-webhook
// Data will be coming like this for incoming messages:
// {
//   "entry": [
//     {
//       "changes": [
//         {
//           "value": {
//             "messages": [
//               {
//                 "from": "919999999999",
//                 "id": "wamid.TEST123",
//                 "timestamp": "1700000000",
//                 "text": {
//                   "body": "Hi bot"
//                 },
//                 "type": "text"
//               }
//             ],
//             "metadata": {
//               "phone_number_id": "920261887834187"
//             }
//           }
//         }
//       ]
//     }
//   ]
// }

import { whatsappSendController } from "../HealthBot/src/api/whatsappController.js";
import { QUESTIONS } from "../HealthBot/src/text/question.js";
import { saveConversation } from "./db/controller/chat.contoller.js";
import { connectDB } from "./db/index.js";

const whatsappBot = async (to, text) => {
  const response = await whatsappSendController(to, text);
  console.log("Message sent successfully:", response.data);
};

export const handler = async (event, context) => {
  // GET: verification handshake (no DB needed)
  if (event.httpMethod === "GET") {
    const VERIFY_TOKEN = "QUxZkpyscYapMEppG7zadr9fycp4EHGpugKfd";
    const params = event.queryStringParameters || {};
    const mode = params["hub.mode"];
    const token = params["hub.verify_token"];
    const challenge = params["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return {
        statusCode: 200,
        body: challenge || "OK",
      };
    }

    return { statusCode: 403, body: "Forbidden" };
  }

  // POST: webhook event from Meta - Initialize DB connection
  if (event.httpMethod === "POST") {
    try {
      await connectDB();
      console.log("DB Connected");
    } catch (err) {
      console.error("Error in connecting to DB:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Database connection failed",
          details: errorMessage,
        }),
      };
    }

    try {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log("WhatsApp webhook event:", JSON.stringify(body));

      const value = body?.entry?.[0]?.changes?.[0]?.value;
      const messages = value?.messages;
      const metadata = value?.metadata;
      const contacts = value?.contacts;

      if (!messages || messages.length === 0) {
        return { statusCode: 200, body: "NO_MESSAGE" };
      }

      const msg = messages[0];
      const from = msg.from; // USER PHONE NUMBER
      const profileName = contacts?.[0]?.profile?.name || "";
      const displayPhoneNumber = metadata?.display_phone_number || "";
      const phoneNumberId = metadata?.phone_number_id || "";

      // Call whatsappBot in background (don't await to respond quickly)
      try {
        const dataToStore = {
          from: from,
          messageId: msg.id,
          conversation_user: msg.text?.body || "",
          conversation_bot: QUESTIONS.whatIsYourName || "",
          type: msg.type,
          timestamp: new Date(Number(msg.timestamp) * 1000),
          display_phone_number: displayPhoneNumber,
          phone_number_id: phoneNumberId,
          profile_name: profileName,
        };

        // TODO: Testing the Whole Process (Static) - Conditions
        if (dataToStore.conversation_user == "Hi") {
          await whatsappBot(from, QUESTIONS.whatIsYourName);
        } else if (dataToStore.conversation_user == "Rahul") {
          await whatsappBot(from, QUESTIONS.howOldAreYou);
        } else if (dataToStore.conversation_user == "23") {
          await whatsappBot(from, QUESTIONS.whatIsYourGender);
        } else if (dataToStore.conversation_user == "Male") {
          await whatsappBot(
            from,
            QUESTIONS.whichDateYouWantToBookAnAppointment
          );
        } else if (dataToStore.conversation_user == "25th December") {
          await whatsappBot(
            from,
            QUESTIONS.whichTimeSlotYouWantToBookAnAppointment
          );
        }

        await saveConversation(dataToStore);
        console.log("Message saved to database successfully.");
      } catch (botError) {
        console.error("WhatsApp bot error:", botError);
        return {
          statusCode: 400,
          body: botError instanceof Error ? botError.message : String(botError),
        };
      }

      // TODO: add your event processing logic here (persist, forward, notify, etc.)

      // Meta expects a 200 response within a short time window.
      return { statusCode: 200, body: "EVENT_RECEIVED" };
    } catch (err) {
      console.error("Error parsing webhook body:", err);
      return { statusCode: 400, body: "Invalid JSON" };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
