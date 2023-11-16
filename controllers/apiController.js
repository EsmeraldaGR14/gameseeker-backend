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
    // console.log(process.env.GIANT_BOMB_API_KEY);

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

// router.post("/", async (req, res) => {
//   try {
//     let url =
//       "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json&limit=10";

//     const data = await fetchDataFromAPI(url);

//     console.log(data);

//     let arrayOfGames = [];
//     const promises = [];

//     for (let i = 0; i < data.results.length; i++) {
//       let objGame = {};

//       const element = data.results[i];
//       let elementURL = element.api_detail_url;
//       let screenshotsURL = element.image_tags.find(
//         (imageURL) => imageURL.name === "Screenshots"
//       );

//       objGame.title = element.name;
//       objGame.esrb = element.original_game_rating
//         ? element.original_game_rating[0].name
//         : null;
//       objGame.description = element.deck;
//       objGame.platforms = element.platforms.map((platform) => platform.name);
//       objGame.boxart = element.image.original_url;
//       objGame.release_date = element.original_release_date;

//       promises.push(
//         (async () => {
//           try {
//             let elementData = await fetchDataFromAPI(
//               elementURL +
//                 "?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json" +
//                 "&filter=original_release_date:2015-01-01|2024-12-31"
//               // https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json
//             );

//             let gameData = elementData.results;
//             objGame.genres = gameData.genres.map((genre) => genre.name);
//             objGame.developer = gameData.developers.map(
//               (developer) => developer.name
//             );
//             objGame.publisher = gameData.publishers.map(
//               (publisher) => publisher.name
//             );

//             // console.log("elementData:", elementData);
//           } catch (error) {
//             // console.log("Error fetching elementData for", ":", error);
//             return error;
//           }
//           return objGame;
//         })()
//       );

//       promises.push(
//         (async () => {
//           try {
//             let elementData = await fetchDataFromAPI(
//               screenshotsURL.api_detail_url +
//                 "&api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json"
//             );
//             let imageData = elementData.results;

//             objGame.screenshots = imageData.map((image) => image.original_url);
//           } catch (error) {
//             // console.log("ERROR FETCHING ELEMENTDATA FOR", ":", error);
//             return error;
//           }
//           return objGame;
//         })()
//       );
//     }

//     const resolvedPromises = await Promise.all(promises);

//     arrayOfGames = [...resolvedPromises];

//     for (let i = 0; i < arrayOfGames.length; i++) {
//       try {
//         await newGame(arrayOfGames[i]);
//       } catch (error) {
//         // console.error("Error inserting game into the database:", error);
//         return error;
//       }
//     }

//     res.json(arrayOfGames);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

router.post("/", async (req, res) => {
  try {
    let url =
      "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json&limit=10";

    const data = await fetchDataFromAPI(url);

    // console.log(data);

    const arrayOfGames = [];
    const promises = [];

    for (let i = 0; i < data.results.length; i++) {
      const element = data.results[i];
      let elementURL = element.api_detail_url;
      let screenshotsURL = element.image_tags.find(
        (imageURL) => imageURL.name === "Screenshots"
      );

      // Create a new objGame for each iteration
      const objGame = {
        title: element.name,
        esrb: element.original_game_rating
          ? element.original_game_rating[0].name
          : null,
        // description: element.deck,
        // platforms: element.platforms.map((platform) => platform.name),
        // boxart: element.image.original_url,
        // release_date: element.original_release_date,
      };

      promises.push(
        (async () => {
          try {
            let elementData = await fetchDataFromAPI(
              elementURL +
                "?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json" +
                "&filter=original_release_date:2015-01-01|2024-12-31"
            );

            let gameData = elementData.results;
            // objGame.genres = gameData.genres.map((genre) => genre.name);
            // objGame.developers = gameData.developers.map(
            //   (developer) => developer.name
            // );
            // objGame.publishers = gameData.publishers.map(
            //   (publisher) => publisher.name
            // );
            objGame.screenshots = gameData.images.map(
              ({ original }) => original
            );

            return objGame;
          } catch (error) {
            return error;
          }
        })()
      );
    }

    const resolvedPromises = await Promise.all(promises);

    // The resolvedPromises array contains the modified objGame objects
    // with genres, developer, publisher, and screenshots properties
    arrayOfGames.push(...resolvedPromises);

    // lopop through arrayOfGames
    // check if there are games that have title === null
    // if that is true then slice, remove it from the array

    // for (let i = 0; i < arrayOfGames.length; i++) {
    // if (arrayOfGames[i] === null) {
    //   arrayOfGames.slice(i, 1);
    // }
    //   console.log(arrayOfGames[i].title);
    // }

    for (let i = 0; i < arrayOfGames.length; i++) {
      try {
        await newGame(arrayOfGames[i]);
      } catch (error) {
        return res
          .status(500)
          .json({ status: "error", message: error.message });
      }
    }

    res.json(arrayOfGames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     let url =
//       "https://www.giantbomb.com/api/games/?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json&limit=10";

//     const data = await fetchDataFromAPI(url);

//     const arrayOfGames = [];
//     const promises = [];

//     for (let i = 0; i < data.results.length; i++) {
//       const element = data.results[i];
//       let elementURL = element.api_detail_url;
//       let screenshotsURL = element.image_tags.find(
//         (imageURL) => imageURL.name === "Screenshots"
//       );

//       // Create a new objGame for each iteration
//       const objGame = {
//         title: element.name,
//         esrb: element.original_game_rating
//           ? element.original_game_rating[0].name
//           : null,
//         description: element.deck,
//         platforms: element.platforms.map((platform) => platform.name),
//         boxart: element.image.original_url,
//         release_date: element.original_release_date,
//       };

//       promises.push(
//         (async () => {
//           try {
//             let elementData = await fetchDataFromAPI(
//               elementURL +
//                 "?api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json" +
//                 "&filter=original_release_date:2015-01-01|2024-12-31"
//             );

//             let gameData = elementData.results;
//             objGame.genres = gameData.genres.map((genre) => genre.name);
//             objGame.developers = gameData.developers.map(
//               (developer) => developer.name
//             );
//             objGame.publishers = gameData.publishers.map(
//               (publisher) => publisher.name
//             );

//             return objGame;
//           } catch (error) {
//             console.error(error);
//             throw error; // Rethrow the error to be caught in the outer catch block
//           }
//         })()
//       );

//       promises.push(
//         (async () => {
//           try {
//             let elementData = await fetchDataFromAPI(
//               screenshotsURL.api_detail_url +
//                 "&api_key=7ce397326f31f77d77c9f00ca086c8f5bc4168fb&format=json"
//             );
//             let imageData = elementData.results;

//             objGame.screenshots = imageData.map((image) => image.original_url);
//             return objGame;
//           } catch (error) {
//             console.error(error);
//             throw error; // Rethrow the error to be caught in the outer catch block
//           }
//         })()
//       );
//     }

//     const resolvedPromises = await Promise.all(promises);

//     // Filter out objects with null titles
//     const validGames = resolvedPromises.filter((game) => game.title !== null);

//     // The validGames array contains the modified objGame objects
//     // with genres, developer, publisher, and screenshots properties
//     arrayOfGames.push(...validGames);

//     for (let i = 0; i < arrayOfGames.length; i++) {
//       try {
//         await newGame(arrayOfGames[i]);
//       } catch (error) {
//         console.error(error);
//         return res
//           .status(500)
//           .json({ status: "error", message: error.message });
//       }
//     }

//     res.json(arrayOfGames);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

module.exports = router;
