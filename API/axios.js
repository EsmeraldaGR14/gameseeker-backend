const axios = require("axios");

const fetchDataFromRawgAPI = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const addGamesToDatabase = async (data) => {
  try {
    const response = await axios.post("http://localhost:3005/games", data);
    return response.data;
  } catch (error) {}
};

module.exports = { fetchDataFromRawgAPI, addGamesToDatabase };
