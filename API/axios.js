const axios = require("axios");

const fetchDataFromAPI = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data ? response.data : response;
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

module.exports = { fetchDataFromAPI, addGamesToDatabase };
