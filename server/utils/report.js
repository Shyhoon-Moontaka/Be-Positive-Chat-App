import { pipeline } from "@huggingface/transformers";

export async function runReport(message) {
  const reviewer = await pipeline(
    "sentiment-analysis",
    "Xenova/bert-base-multilingual-uncased-sentiment",
    {
      dtype: "auto",
    }
  );

  const result = await reviewer(message);
  return result;
}
