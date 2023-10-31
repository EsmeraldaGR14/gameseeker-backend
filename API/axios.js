const axios = require("axios");

const fetchDataFromAPI = async () => {
  try {
    let response = await axios.getAdapter(
      "https://api.rawg.io/api/games?key=0cf40416b0b548dea1d637509c3e7801"
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fetchDataFromAPI };
