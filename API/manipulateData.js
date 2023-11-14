// const { fetchDataFromAPI, addGamesToDatabase } = require("./axios");

// const { fetchAllGamesfromGiantBomb, fetchSingleGameDataFromGiantBomb,} = require("./axios");
// const { newGame } = require("../queries/games.js");

// async function getGamesFromApi(result) {
//   let arrayOfGames = [];
//   data.results.forEach((element) => {
//     let objGame = {};

//     objGame.title = element.aliases;
//     // objGame.genres = element.genres.map((genre) => genre.name);
//     // objGame.rating = element.rating;
//     // objGame.platforms = element.platforms.map(
//     //   (platform) => platform.platform.name
//     // );
//     // objGame.esrb = element.esrb_rating.name;
//     // objGame.released_year = element.released;
//     // objGame.screenshots = element.short_screenshots.map((image) => image.image);
//     // objGame.playtime = element.playtime;

//     arrayOfGames.push(objGame);
//   });

//   return arrayOfGames;
//   // I am assigning the variables to their respective columns
// }

// const extractGameInfo = (result) => {
//   const gameInfo = {
//     title: result.name ?? "n/a",
//     genres: result.genres?.map((genre) => genre.name) ?? [],
//     esrb: result.original_game_rating?.[0]?.name ?? "n/a",
//     description: result.deck ?? "n/a",
//     platforms: result.platforms?.map((platform) => platform.name) ?? [],
//     boxart: result.image?.original_url ?? "",
//     release_date: result.original_release_date ?? null,
//     developer: result.developers?.map((developer) => developer.name) ?? [],
//     publisher: result.publishers?.map((publisher) => publisher.name) ?? [],
//     screenshots: result.images?.map((image) => image.original) ?? [],
//   };
//   return gameInfo;
// };

// async function addGamesFromApisToDatabase() {
//   const maxRetries = 10;
//   let retries = 0;

//   while (retries < maxRetries) {
//     try {
//       console.log("Fetching games from Giant Bomb API...");
//       const gameDetailUrls = await fetchAllGamesfromGiantBomb();
//       console.log(`Fetched ${gameDetailUrls.length} game URLs.`);

//       const batchSize = 10;
//       let gamesProcessed = 0;
//       let processedGameUrls = new Set();

//       for (let i = 0; i < gameDetailUrls.length; i += batchSize) {
//         const batchUrls = gameDetailUrls
//           .slice(i, i + batchSize)
//           .filter((url) => !processedGameUrls.has(url));

//         if (batchUrls.length === 0) {
//           console.log(
//             `All games in batch ${
//               i / batchSize + 1
//             } have already been processed.`
//           );
//           continue;
//         }

//         const gameInfoPromises = batchUrls.map(async (url) => {
//           const gameInfo = await fetchSingleGameDataFromGiantBomb(url);
//           return extractGameInfo(gameInfo);
//         });

//         const batchGameInfo = await Promise.all(gameInfoPromises);

//         console.log(`Processing batch ${i / batchSize + 1}...`);

//         for (let game of batchGameInfo) {
//           const newGameResult = await newGame(game);
//           gamesProcessed++;
//           processedGameUrls.add(game.api_detail_url);
//         }

//         if (i + batchSize < gameDetailUrls.length) {
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//         }
//       }

//       console.log(`Finished inserting ${gamesProcessed} games.`);
//       return {
//         status: "success",
//         message: `Processed ${gamesProcessed} games.`,
//       };
//     } catch (error) {
//       console.error(
//         `Error during data processing (Retry ${retries + 1}):`,
//         error
//       );
//       console.error(`Retries so far: ${retries + 1}`);
//       console.error(`Error message: ${error.message}`);
//       retries++;
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//     }
//   }

//   return {
//     status: "error",
//     message:
//       `Error during data processing. Max retries reached. ${error.message}`,
//   };
// }

// module.exports = { getGamesFromApi, addGamesFromApisToDatabase };
