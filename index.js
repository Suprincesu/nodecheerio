const express = require("express");
const fs = require("fs");
const hbs = require("express-handlebars");
const path = require("path");
const HoroscopeScrapper = require("./scrapper/scrapeHoroscope");
const HimalayanScrapper = require("./scrapper/scrapeHimalayan");
const fileUtils = require("./utils/fileUtils");
const moment = require("moment-timezone");
const app = express();

// Setting up view engine config
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/public/views/layouts/",
    partialsDir: [__dirname + "/public/views/partials"],
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
      date: function (value, options) {
        return moment(value).tz("Asia/Kathmandu").format("MMMM Do YYYY");
      },
    },
  })
);

// View engine setup
app.set("views", path.join(__dirname + "/public/", "views"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  const horoscopes = fileUtils.readHoroscopeFile("horoscope.json");
  res.render("home", {
    horoscopes,
  });
});

app.get("/himalayan", (req, res) => {
  const horoscopes = fileUtils.readHoroscopeFile("himalayan.json");
  res.render("home", {
    horoscopes,
  });
});

app.get("/horoscope/:src/:horoscope", (req, res) => {
  const search = req.params.horoscope;
  const src = req.params.src;
  let horoscopes;
  if (src.toLowerCase() == "himalayan") {
    horoscopes = fileUtils.readHoroscopeFile("himalayan.json");
  } else {
    horoscopes = fileUtils.readHoroscopeFile("horoscope.json");
  }

  const filteredHoroscope = horoscopes.filter(
    (horoscope) => horoscope.name.toLowerCase().trim() == search.toLowerCase().trim()
  );
  if (filteredHoroscope.length > 0) {
    res.send(filteredHoroscope[0]);
  } else {
    res.send({
      msg:"Horoscope not found"
    });
  }
});

app.get("/scrape", async (req, res) => {
  await HoroscopeScrapper.start();
  await HimalayanScrapper.start();
  res.send({
    msg: "Scrapping completed",
  });
});

app.listen(8989, () => {
  console.log("Listening to port 8989");
});
