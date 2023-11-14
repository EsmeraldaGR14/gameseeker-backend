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

router.post("/", async (req, res) => {
  try {
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json";

    const data = await fetchDataFromAPI(url);

    let arrayOfGames = [];
    const promises = [];

    for (let i = 0; i < data.results.length; i++) {
      const element = data.results[i];
      let objGame = {};
      let elementURL = element.api_detail_url;

      objGame.title = element.name;
      objGame.esrb = element.original_game_rating
        ? element.original_game_rating[0].name
        : null;
      objGame.genres = ["genre"];
      objGame.rating = 1.5;
      objGame.platforms = ["platform"];
      objGame.boxart = "string";
      objGame.subscription = "string";
      objGame.released_year = "string";

      /*
      id SERIAL PRIMARY KEY,
      title VARCHAR(300) NOT NULL,
      genres VARCHAR[] NOT NULL,
      rating DECIMAL(3,1),
      description TEXT,
      platforms VARCHAR[],
      boxart VARCHAR,
      esrb VARCHAR,
      subscription VARCHAR,
      released_year VARCHAR(12),
      developer VARCHAR,
      publisher VARCHAR,
      screenshots VARCHAR[],
      playtime INTEGER,
      completion_time INTEGER
      */

      promises.push(
        (async () => {
          try {
            let elementData = await fetchDataFromAPI(
              elementURL +
                "?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json"
            );
            objGame.description =
              "this is just a test to see if the data is being retrieved and integrated correctly," +
              elementData.results.id;
            // console.log("elementData:", elementData);
          } catch (error) {
            console.log(
              "Error fetching elementData for",

              ":",
              error
            );
          }
          return objGame;
        })()
      );
      arrayOfGames.push(objGame);
    }

    arrayOfGames = await Promise.all(promises);

    for (let i = 0; i < arrayOfGames.length; i++) {
      try {
        await newGame(arrayOfGames[i]);
      } catch (error) {
        console.error("Error inserting game into the database:", error);
      }
    }

    res.json(arrayOfGames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
