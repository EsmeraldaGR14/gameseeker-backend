const axios = require("axios");
require("dotenv").config();

const fetchDataFromAPI = async (url) => {
  try {
    const response = await axios.get(url);

    return response.data ? response.data : response;
  } catch (error) {
    console.log("axios error:", error);
    return error;
  }
};

const fetchDataFromXboxAPI = async (url) => {
  try {
    const response = await axios.get(url);

    
    if (response.data) {
      return response.data.map((item) => item.id);
    }
    return [];
  } catch (error) {
    console.log("axios error:", error);
    return error;
  }
};

module.exports = {
  fetchDataFromAPI,
  fetchDataFromXboxAPI,
};
