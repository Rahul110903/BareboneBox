import { whatsappSendController } from "./api/whatsappController.js";
import { QUESTIONS } from "./text/question.js";

const whatsappBot = async () => {
  try {
    const response = await whatsappSendController(QUESTIONS.whatIsYourName);
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default whatsappBot;
