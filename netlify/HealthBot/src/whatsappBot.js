import { whatsappSendController } from "./api/whatsappController.js";
import { QUESTIONS } from "./text/question.js";

const whatsappBot = () => {
  const sendMessage = async () => {
    try {
      const response = await whatsappSendController(QUESTIONS.whatIsYourName);
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  sendMessage();
};

export default whatsappBot;
