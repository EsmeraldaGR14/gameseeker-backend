const express = require("express");
const router = express.Router();

const { fetchDataFromAPI } = require("../API/axios");
// const { getGamesFromApi } = require("../API/manipulateData");

const { newGame } = require("../queries/games");

router.get("/", async (req, res) => {
  try {
    // const initialData = await fetchDataFromAPI();
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json";
    console.log(process.env.GIANT_BOMB_API_KEY);

    const data = await fetchDataFromAPI(url);
    // arrayOfGames = [...arrayOfGames, getGamesFromApi(data.results)];
    // let arrayOfGames = [getGamesFromApi(data.results)];
    // console.log(arrayOfGames);

    // let arrayOfGames = [];
    // initialData.results.forEach((element) => {
    //   let objGame = {};

    //   objGame.title = element.aliases;
    //   // objGame.genre = element.genres;
    //   // objGame.rating = element.rating;
    //   // objGame.platform = element.platforms;
    //   // objGame.esrb = element.esrb_rating.name;
    //   // objGame.released_year = element.released;
    //   // objGame.screenshots = element.short_screenshots;
    //   // objGame.playtime = element.playtime;

    //   arrayOfGames.push(objGame);
    // });

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

/*
      id SERIAL PRIMARY KEY,
      rating DECIMAL(3,1), NONE
      subscription VARCHAR,
      screenshots VARCHAR[], NONE
      playtime INTEGER,
      completion_time INTEGER NONE
      */

router.post("/", async (req, res) => {
  try {
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json&limit=10";

    const data = await fetchDataFromAPI(url);

    console.log(data);

    let arrayOfGames = [];
    const promises = [];

    for (let i = 0; i < data.results.length; i++) {
      let objGame = {};

      const element = data.results[i];
      let elementURL = element.api_detail_url;
      let screenshotsURL = element.image_tags.find(
        (imageURL) => imageURL.name === "Screenshots"
      );

      objGame.title = element.name;
      objGame.esrb = element.original_game_rating
        ? element.original_game_rating[0].name
        : null;
      objGame.description = element.deck;
      objGame.platforms = element.platforms.map((platform) => platform.name);
      objGame.boxart = element.image.original_url;
      objGame.release_date = element.original_release_date;

      promises.push(
        (async () => {
          try {
            let elementData = await fetchDataFromAPI(
              elementURL +
                "?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json" +
                "&filter=original_release_date:2015-01-01|2024-12-31"
              // https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json
            );

            let gameData = elementData.results;
            objGame.genres = gameData.genres.map((genre) => genre.name);
            objGame.developer = gameData.developers.map(
              (developer) => developer.name
            );
            objGame.publisher = gameData.publishers.map(
              (publisher) => publisher.name
            );

            // console.log("elementData:", elementData);
          } catch (error) {
            // console.log("Error fetching elementData for", ":", error);
            return error;
          }
          return objGame;
        })()
      );

      promises.push(
        (async () => {
          try {
            let elementData = await fetchDataFromAPI(
              screenshotsURL.api_detail_url +
                "&api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json"
            );
            let imageData = elementData.results;

            objGame.screenshots = imageData.map((image) => image.original_url);
            arrayOfGames.push(objGame);
          } catch (error) {
            // console.log("ERROR FETCHING ELEMENTDATA FOR", ":", error);
            return error;
          }
          return objGame;
        })()
      );
    }

    arrayOfGames = await Promise.all(promises);

    for (let i = 0; i < arrayOfGames.length; i++) {
      try {
        await newGame(arrayOfGames[i]);
      } catch (error) {
        // console.error("Error inserting game into the database:", error);
        return error;
      }
    }

    res.json(arrayOfGames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
