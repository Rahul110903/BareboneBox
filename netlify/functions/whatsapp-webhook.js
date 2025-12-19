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

import whatsappBot from "../HealthBot/src/whatsappBot.js";

export const handler = async (event, context) => {
  // GET: verification handshake
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

  // POST: webhook event from Meta
  if (event.httpMethod === "POST") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log("WhatsApp webhook event:", JSON.stringify(body));

      // Call whatsappBot in background (don't await to respond quickly)
      try {
        await whatsappBot();
        console.log("WhatsApp bot executed successfully.");
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
