const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const natural = require("natural");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.post("/api/summarize", async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch Wikipedia page content
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract text from the Wikipedia page
    const pageText = $("body").text();

    // Analyze the text for bankruptcy and fraud
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(pageText.toLowerCase());

    const keywords = {
      bankruptcy: ["bankruptcy", "bankrupt"],
      fraud: ["fraud", "fraudulent"],
    };

    const checkKeywords = (tokens, keywords) => {
      return keywords.some((keyword) => tokens.includes(keyword));
    };

    const hasBankruptcy = checkKeywords(tokens, keywords.bankruptcy);
    const hasFraud = checkKeywords(tokens, keywords.fraud);

    res.json({
      hasBankruptcy,
      hasFraud,
      summary: {
        text: pageText.substring(0, 500), // Sample summary
        // Additional logic can be added to provide a better summary
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while processing the Wikipedia page.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
