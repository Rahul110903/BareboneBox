// Netlify Function to handle Meta WhatsApp Webhook verification and events
// Deploy this to Netlify and set the webhook URL to:
// https://<your-site>.netlify.app/.netlify/functions/whatsapp-webhook

exports.handler = async (event, context) => {
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
