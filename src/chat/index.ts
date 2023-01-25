import { ChatGPTAPIBrowser, AChatGPTAPI, ChatResponse } from "chatgpt";
import { oraPromise } from "ora";

export const createChatGptApi = async (): Promise<AChatGPTAPI> => {
  const email = process.env.OPENAI_EMAIL;
  const password = process.env.OPENAI_PASSWORD;
  if (!email || !password) {
    console.error("Please set your OpenAI email and password in the .env file");
    process.exit(1);
  }

  return await new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: false,
  });
};

interface SendMessageOptions {
  api: AChatGPTAPI;
  message: string;
  conversationId?: string;
}

export const sendMessage = async (
  options: SendMessageOptions
): Promise<ChatResponse> => {
  const { api, message, conversationId } = options;
  const res = await oraPromise(api.sendMessage(message, { conversationId }), {
    text: `Sending message: \n ${message.slice(0, 20)}...`,
  });
  return res;
};
