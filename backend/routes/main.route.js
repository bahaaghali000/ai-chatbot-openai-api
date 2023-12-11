const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer " + "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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = router;
