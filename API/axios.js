const axios = require("axios");
require("dotenv").config();

const fetchAllGamesfromGiantBomb = async (lastSuccessfulOffset = 0) => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      let allGameDetailUrls = [];
      let hasMoreGames = true;
      let offset = lastSuccessfulOffset;
      const totalGamesToFetch = 500;
      const limit = 100;

      while (hasMoreGames && allGameDetailUrls.length < totalGamesToFetch) {
        const response = await axios.get(
          `https://www.giantbomb.com/api/games/?api_key=${process.env.GIANTBOMB_API_KEY}&format=json&field_list=api_detail_url&limit=${limit}&offset=${offset}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch games from Giant Bomb API");
        }

        const gameDetailUrls = response.data.results.map(
          (gameDetailUrl) => gameDetailUrl.api_detail_url
        );

        allGameDetailUrls = allGameDetailUrls.concat(gameDetailUrls);
        offset += limit;

        // For fetching all games from API
        // hasMoreGames = response.data.number_of_total_results > offset;

        hasMoreGames = allGameDetailUrls.length < totalGamesToFetch;

        console.log(`Processed ${offset} URLs.`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      return allGameDetailUrls;
    } catch (error) {
      console.error(
        `Error during data fetching (Retry ${retries + 1}):`,
        error.message
      );
      console.error(`Retries so far: ${retries + 1}`);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error("Max retries reached for fetching urls.");
};

const fetchSingleGameDataFromGiantBomb = async (gameDetailUrl) => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(
        `${gameDetailUrl}?api_key=${process.env.GIANTBOMB_API_KEY}&format=json&field_list=genres,name,platforms,summary,deck,developers,image,original_game_rating,original_release_date,publishers,images`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return response.data.results;
    } catch (error) {
      console.error(
        `Error during data fetching (Retry ${retries + 1}):`,
        error.message
      );
      console.error(`Retries so far: ${retries + 1}`);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error(
    `Max retries reached for fetching game data from ${gameDetailUrl}.`
  );
};

module.exports = {
  fetchAllGamesfromGiantBomb,
  fetchSingleGameDataFromGiantBomb,
};
