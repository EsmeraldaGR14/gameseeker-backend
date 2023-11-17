// require("dotenv").config();

const express = require("express");
const router = express.Router();

const { fetchDataFromAPI } = require("../API/axios");

const { newGame } = require("../queries/games");
const { proc } = require("../db/dbConfig");

router.get("/", async (req, res) => {
  try {
    let url = `https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json`;

    const data = await fetchDataFromAPI(url);

    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(error.status)
      .json({ error: "Failed to fetch data from the API" });
  }
});

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
    console.log(process.env.GIANT_BOMB_API_KEY);
    let url = `https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json`;

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
        platforms: element.platforms.map((platform) => platform.name),
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
      } catch (error) {
        console.log("database integration error:", error);
        return res.status(error.status).json({ message: error.message });
      }
    }

    res.json(arrayOfGames);
  } catch (error) {
    console.error(error);
    res.status(error.status).json({ message: error.message });
  }
});

module.exports = router;
