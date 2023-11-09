const express = require("express");
const router = express.Router();

const { fetchDataFromRawgAPI } = require("../API/axios");
const { getGamesFromRawgApi } = require("../API/manipulateData");

const { newGame } = require("../queries/games");

router.get("/", async (req, res) => {
  try {
    const initialData = await fetchDataFromRawgAPI();
    // arrayOfGames = [...arrayOfGames, getGamesFromRawgApi(data.results)];
    // let arrayOfGames = [getGamesFromRawgApi(data.results)];
    // console.log(arrayOfGames);

    let arrayOfGames = [];
    initialData.results.forEach((element) => {
      let objGame = {};

      objGame.title = element.name;
      objGame.genre = element.genres;
      objGame.rating = element.rating;
      objGame.platform = element.platforms;
      objGame.esrb = element.esrb_rating.name;
      objGame.released_year = element.released;
      objGame.screenshots = element.short_screenshots;
      objGame.playtime = element.playtime;

      arrayOfGames.push(objGame);
    });

    res.json(initialData.results);
  } catch (error) {
    console.error(error);
    res
      .status(error.status)
      .json({ error: "Failed to fetch data from the API" });
  }
});

router.post("/", async (req, res) => {
  try {
    // pass in the url
    // let url = req.body;
    let url = req.body.url;

    const data = await fetchDataFromRawgAPI(url);

    // const data = await fetchDataFromRawgAPI(
    //   "https://api.rawg.io/api/games?key=0cf40416b0b548dea1d637509c3e7801&page=2&token="
    // );

    let arrayOfGames = [];

    data.results.forEach((element) => {
      let objGame = {};

      objGame.title = element.name;

      objGame.genres = element.genres.map((genre) => genre.name);
      objGame.rating = element.rating;
      objGame.platforms = element.platforms.map(
        (platform) => platform.platform.name
      );
      objGame.esrb = element.esrb_rating ? element.esrb_rating.name : null;

      objGame.released_year = element.released;
      objGame.screenshots = element.short_screenshots.map(
        (image) => image.image
      );
      objGame.playtime = element.playtime;

      arrayOfGames.push(objGame);
    });

    for (let i = 0; i < arrayOfGames.length; i++) {
      try {
        await newGame(arrayOfGames[i]);
      } catch (error) {
        console.error("Error inserting game into the database:", error);
      }
    }

    res.json(arrayOfGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
