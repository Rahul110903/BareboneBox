import axios from "axios";

export const apiClient = async ({ method, url, data }) => {
  try {
    return await axios.request(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: data,
    });
  } catch (error) {
    throw error;
  }
};
