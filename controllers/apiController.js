// require("dotenv").config();

const express = require("express");
const router = express.Router();
const {
  newGame,
  insertGameSubscription,
} = require("../queries/games");
const { fetchDataFromAPI, fetchDataFromXboxAPI } = require("../API/axios");
const { proc } = require("../db/dbConfig");

router.get("/", async (req, res) => {
  try {
    // let url = `https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json`;
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&filter=original_release_date:2015-01-01T00:00:00Z|2023-12-01T00:00:00Z&format=json";

    const data = await fetchDataFromAPI(url);

    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status)
      .json({ error: "Failed to fetch data from the API" });
  }
});

const updateGamesWithSubscription = async (subscriptionService, mainUrl, arrayOfGames) => {
  try {
    const gameIds = await fetchDataFromXboxAPI(mainUrl);
    let updatedGames = [];
    const extractedData = await Promise.all(
      gameIds.map(async (id) => {
        const gameDataUrl = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${id}&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp`;
        const gameData = await fetchDataFromAPI(gameDataUrl);

        return gameData.Products.map((product) => ({
          title: product.LocalizedProperties[0].ProductTitle,
          service: subscriptionService,
        }));
      })
    );

    const flattenedData = extractedData.flat();

    // Fetch all games from the database
    // const allGamesFromDB = await allGames();

    // Iterate over the API games
    for (const apiGame of flattenedData) {
      // Find the corresponding game in the database
      const matchingGame = arrayOfGames.find((dbGame) =>
        dbGame.title.toLowerCase().includes(apiGame.title.toLowerCase())
      );
      // If a match is found, insert subscription information
      if (matchingGame) {
        const updatedGame = {
          ...matchingGame,
          subscription: [apiGame.service],
        };
        try {
          await insertGameSubscription(updatedGame.title, apiGame.service);
          console.log(matchingGame);
          updatedGames.push(updatedGame);
        } catch (error) {
          console.error("Error updating game subscription:", error);
        }
      }
    }
    console.log("Updated games:", updatedGames);
    return updatedGames;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/* GIANT BOMB API

** fetch all of the data of ALL GAMES
** loop through each ELEMENT 
** create an ARRAY OF OBJECTS
** get each elements URL
** fetch DETAILS of each element
** get remaining details for each element
** loop through the ARRAY OF OBJECTS 
** POST each element individually and use timeout()

*/

router.post("/", async (req, res) => {
  try {
    // let url = `https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json`;
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&filter=original_release_date:2020-01-01T00:00:00Z|2023-12-01T00:00:00Z&format=json";

    const data = await fetchDataFromAPI(url);

    const arrayOfGames = [];
    const promises = [];

    for (let i = 0; i < data.results.length; i++) {
      const element = data.results[i];
      let elementURL = element.api_detail_url;
      let screenshotsURL = element.image_tags.find(
        (imageURL) => imageURL.name === "Screenshots"
      );

      const objGame = {
        title: element.name,
        esrb: element.original_game_rating
          ? element.original_game_rating[0].name
          : null,
        description: element.deck,
        platforms: Array.isArray(element.platforms)
          ? element.platforms.map((platform) => platform.name)
          : [],
        boxart: element.image.original_url,
        release_date: element.original_release_date,
      };

      promises.push(
        (async () => {
          try {
            let elementData = await fetchDataFromAPI(
              elementURL +
                `?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json` +
                `&filter=original_release_date:2015-01-01|2024-12-31`
            );

            let gameData = elementData.results;
            objGame.genres = Array.isArray(gameData.genres)
              ? gameData.genres.map((genre) => genre.name)
              : [];
            objGame.developers = Array.isArray(gameData.developers)
              ? gameData.developers.map((developer) => developer.name)
              : [];
            objGame.publishers = Array.isArray(gameData.publishers)
              ? gameData.publishers.map((publisher) => publisher.name)
              : [];
            objGame.screenshots = Array.isArray(gameData.images)
              ? gameData.images.slice(0, 3).map(({ original }) => original)
              : [];

            return objGame;
          } catch (error) {
            console.log("promise error:", error);
            return error;
          }
        })()
      );
    }

    const resolvedPromises = await Promise.all(promises);
    arrayOfGames.push(...resolvedPromises);

    for (let i = 0; i < arrayOfGames.length; i++) {
      try {
        await newGame(arrayOfGames[i]);
        console.log("Game added to the database:", arrayOfGames[i].title);
      } catch (error) {
        console.log("database integration error:", error);
        return res.status(error.status).json({ message: error.message });
      }
    }

    let updatedXboxGames = await updateGamesWithSubscription(
      "Xbox Game Pass",
      "https://catalog.gamepass.com/sigls/v2?id=f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e&language=en-us&market=US",
      arrayOfGames
    );
   
    let updatedPCGames = await updateGamesWithSubscription(
      "PC Game Pass",
      "https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-us&market=US",
      arrayOfGames
    );

    res.json(arrayOfGames);
  } catch (error) {
    console.error(error);
    res.status(error.status).json({ message: error.message });
  }
});

module.exports = router;
