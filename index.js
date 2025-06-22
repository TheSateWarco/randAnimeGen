import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    console.log("get")
    const response = await axios.get("https://api.jikan.moe/v4/random/anime");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// giv the data from api to ejs
app.post("/", async (req, res) => {
  console.log("Body:", req.body);
  // no genre ________________________________fix to any genre
  if (!req.body.genre) {
    console.log("Genre not found in body!");
  }
  try {
    console.log(req.body);
    // get genre
    const genreName = req.body.genre.toLowerCase();
    const genreId = genreMap[genreName];
    // use api to find animes w genre
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=25`
    );
    const result = response.data.data; 
    // random anime
    const randomAnime = result[Math.floor(Math.random() * result.length)];
    console.log(randomAnime)
    res.render("index.ejs", {
      data: randomAnime ,
    }
);
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});


const genreMap = {
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  avantgarde: 5,
  demons: 6,
  mystery: 7,
  drama: 8,
  fantasy: 10,
  game: 11,
  historical: 13,
  horror: 14,
  kids: 15,
  martialarts: 17,
  mecha: 18,
  music: 19,
  parody: 20,
  samurai: 21,
  romance: 22,
  school: 23,
  scifi: 24,
  shoujo: 25,
  girlslove: 26,
  shounen: 27,
  boyslove: 28,
  space: 29,
  sports: 30,
  superpower: 31,
  vampire: 32,
  harem: 35,
  sliceoflife: 36,
  supernatural: 37,
  military: 38,
  police: 39,
  psychological: 40,
  suspense: 45,
  seinen: 42,
  josei: 43,
  genderbender: 44,
  awardwinning: 46,
  gourmet: 47,
  worklife: 48,
  // add more genres as needed
};
