const express = require("express");
const router = express.Router();

const { fetchDataFromAPI } = require("../API/axios");

router.get("/", async (req, res) => {
  try {
    const data = await fetchDataFromAPI();
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status)
      .json({ error: "Failed to fetch data from the API" });
  }
});

module.exports = router;
