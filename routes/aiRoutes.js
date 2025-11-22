import express from "express";
import { HfInference } from "@huggingface/inference";

const router = express.Router();

// Put your HuggingFace key here
const hf = new HfInference(process.env.HF_API_KEY);

router.post("/summary", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

const result = await hf.summarization({
  model: "sshleifer/distilbart-cnn-12-6",
  inputs: text
});

    res.json({ summary: result.summary_text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
