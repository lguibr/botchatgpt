import dotenv from "dotenv-safe";

import { oraPromise } from "ora";

import { createChatGptApi, sendMessage } from "./chat";
import { readFileAndProcessPerChunk } from "./utils/file";

dotenv.config();

const main = async () => {
  let conversationId: string | undefined = undefined;

  const api = await createChatGptApi();
  await oraPromise(api.initSession(), { text: "Initializing session" });

  const filePath = "longtext.txt";
  const maxLinesPerChunk = 200;
  const splitInLines = (str: string) => str.split("\n");

  const converse = async (message: string): Promise<void> => {
    const res = await sendMessage({ api, message, conversationId });
    conversationId = res.conversationId;
    const formattedResponse = `Response: \n ${res.response} \n`;
    console.log(formattedResponse);
  };

  await readFileAndProcessPerChunk({
    filePath,
    maxChunks: maxLinesPerChunk,
    processStringChunk: converse,
    splitInChunks: splitInLines,
  });

  const resp = await sendMessage({
    api,
    message:
      "Give me a feedback in the code above, with details and mention opportunities to improve the code as well.",
    conversationId,
  });

  await api.closeSession();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
