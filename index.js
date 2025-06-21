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

    console.log("post")
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
  comedy: 4,
  drama: 8,
  fantasy: 10,
  horror: 14,
  music: 40,
  romance: 22,
  sciFi: 24,
  sports: 30,
  thriller: 41,
  // add more genres as needed
};