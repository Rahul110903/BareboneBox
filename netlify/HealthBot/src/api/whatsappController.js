import { whatsappSendGateway } from "./whatsappGateway.js";

export const whatsappSendController = async (to, questions) => {
  try {
    const params = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: questions },
    };

    const response = await whatsappSendGateway(params);
    return response;
  } catch (error) {
    throw error;
  }
};
