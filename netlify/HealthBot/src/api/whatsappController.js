import { whatsappSendGateway } from "./whatsappGateway.js";

export const whatsappSendController = async (questions) => {
  try {
    const params = {
      messaging_product: "whatsapp",
      to: "919289734037",
      type: "text",
      text: { body: questions },
    };

    const response = await whatsappSendGateway(params);
    return response;
  } catch (error) {
    throw error;
  }
};
