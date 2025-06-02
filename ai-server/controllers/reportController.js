import { pipeline } from "@xenova/transformers";

export const reportMessage = async (req, res) => {
  const { message } = req.body;
  try {
    const reviewer = await pipeline(
      "sentiment-analysis",
      "Xenova/bert-base-multilingual-uncased-sentiment",
      {
        dtype: "auto",
      }
    );

    const result = await reviewer(message);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};
