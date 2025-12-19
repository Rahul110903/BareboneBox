import { apiClient } from "./apiClient.js";
import { WHATSAPP_API_URL } from "./endpoints.js";

export const whatsappSendGateway = async (params) => {
  try {
    return await apiClient({
      method: "POST",
      url: WHATSAPP_API_URL,
      data: params,
    });
  } catch (error) {
    throw error;
  }
};
