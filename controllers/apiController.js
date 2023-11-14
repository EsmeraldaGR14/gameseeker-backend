const express = require("express");
const router = express.Router();

const { addGamesFromApisToDatabase } = require("../API/manipulateData");

router.post("/", async (req, res) => {
  try {
    
    const requestData = req.body;

    const result = await addGamesFromApisToDatabase(requestData);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
