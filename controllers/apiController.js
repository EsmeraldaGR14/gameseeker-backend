const express = require("express");
const router = express.Router();

const { addGamesFromApisToDatabase } = require("../API/manipulateData");

router.get("/", async (req, res) => {
  try {
    const initialData = await addGamesFromApisToDatabase();

    res.json(initialData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
})

module.exports = router;
