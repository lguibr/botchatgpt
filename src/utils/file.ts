import { createReadStream } from "fs";

interface readFileAndProcessPerChunkOptions {
  filePath: string;
  maxChunks: number;
  processStringChunk: (str: string) => Promise<void>;
  splitInChunks: (str: string) => string[];
}

export async function readFileAndProcessPerChunk(
  options: readFileAndProcessPerChunkOptions
) {
  const { filePath, maxChunks, processStringChunk, splitInChunks } = options;

  const stream = createReadStream(filePath);
  let buffer = Buffer.alloc(0);

  for await (const chunk of stream) {
    let currentChunk = chunk.toString();
    let words = splitInChunks(currentChunk);

    while (words.length >= maxChunks) {
      currentChunk = words.slice(0, maxChunks).join(" ");
      await processStringChunk(currentChunk);
      words = words.slice(maxChunks);
    }

    buffer = Buffer.from(words.join(" "));
  }
}
