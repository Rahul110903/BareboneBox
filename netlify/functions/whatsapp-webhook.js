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

const whatsappBot = require("../HealthBot/src/whatsappBot");

exports.handler = async (event, context) => {
  // GET: verification handshake
  if (event.httpMethod === "GET") {
    const VERIFY_TOKEN = "QUxZkpyscYapMEppG7zadr9fycp4EHGpugKfd";
    const params = event.queryStringParameters || {};
    const mode = params["hub.mode"];
    const token = params["hub.verify_token"];
    const challenge = params["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge || "OK", { status: 200 });
    }

    return new Response("Forbidden", { status: 403 });
  }

  // POST: webhook event from Meta
  if (event.httpMethod === "POST") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log("WhatsApp webhook event:", JSON.stringify(body));

      whatsappBot();

      // TODO: add your event processing logic here (persist, forward, notify, etc.)

      // Meta expects a 200 response within a short time window.
      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (err) {
      console.error("Error parsing webhook body:", err);
      return new Response("Invalid JSON", { status: 400 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
};
