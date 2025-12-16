# WhatsApp (Meta) webhook on Netlify

Steps to wire WhatsApp webhooks to a Netlify site using Netlify Functions.

## 1) Add environment variables on Netlify

- `WHATSAPP_VERIFY_TOKEN` — a secret string you set here and in Meta's webhook verification settings.

## 2) Deploy the site

After deploy, your webhook URL will be:

```
https://<your-site>.netlify.app/.netlify/functions/whatsapp-webhook
```

## 3) In Meta App Dashboard → Webhooks (WhatsApp)

Set the Callback URL to the URL above and the Verify Token to the same `WHATSAPP_VERIFY_TOKEN` you set in Netlify.

## 4) Test verification locally (Netlify dev) or with curl

Replace `https://<your-site>.netlify.app` with your site URL.

**Verification (GET) example:**

```bash
curl "https://<your-site>.netlify.app/.netlify/functions/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE"
```

**Event delivery (POST) example:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"id":"123","changes":[{"value":{"messages":[{"from":"447700900000","text":{"body":"Hi"}}]}}]}]}' \
  https://<your-site>.netlify.app/.netlify/functions/whatsapp-webhook
```

## 5) Local development

- Use the Netlify CLI to run functions locally: `netlify dev` will route `/.netlify/functions/*` endpoints.
- For public testing during development you can use a tunnel (ngrok) and point Meta to the tunnel URL.

## 6) Notes

- Netlify static sites alone cannot handle incoming webhooks; functions are required to receive GET and POST requests.
- Keep `WHATSAPP_VERIFY_TOKEN` secret. Do not commit private tokens to source control.
