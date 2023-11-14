const express = require("express");
const router = express.Router();

const { addGamesFromApisToDatabase } = require("../API/manipulateData");

const validateRequestBody = (requestData) => {
  if (!requestData.hasOwnProperty("lastSuccessfulOffset")) {
    throw new Error("Missing required field: lastSuccessfulOffset");
  }

  if (!isNaN(requestData.lastSuccessfulOffset)) {
    throw new Error("Invalid lastSuccessfulOffset");
  }

  return true;
};

router.post("/", async (req, res) => {
  try {
    
    const requestData = req.body;
    validateRequestBody(requestData);

    const result = await addGamesFromApisToDatabase(requestData);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
