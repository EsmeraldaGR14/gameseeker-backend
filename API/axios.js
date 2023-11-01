const axios = require("axios");

const fetchDataFromAPI = async () => {
  try {
    const response = await axios.get(
      "https://api.rawg.io/api/games?key=0cf40416b0b548dea1d637509c3e7801"
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

module.exports = { fetchDataFromAPI };
