const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const FileUtils = require("../utils/fileUtils");

const url = "https://www.horoscope.com";
async function scrapeHoroscope() {
  const response = await axios.get(url + "/us/index.aspx");
  const $ = cheerio.load(response.data);

  const chooseZodiac = $(".choose-zodiac").find("div");
  const data = [];
  $(chooseZodiac)
    .find("a")
    .each(function (i, elem) {
      const temp = {
        name: $(this).find("h3").html(),
        url: $(this).attr("href"),
        range: $(this).find("p").html(),
      };
      data.push(temp);
    });
  return data;
}

async function getHoroscopeData(horoscope) {
  const response = await axios.get(url + horoscope.url);
  const $ = cheerio.load(response.data);

  const zodiacData = $(".main-horoscope").find("p").first().text();
  return zodiacData;
}

async function start() {
  const horoscopes = await scrapeHoroscope();
  for (const horoscope of horoscopes) {
    const zodiacData = await getHoroscopeData(horoscope);
    horoscope["horoscope"] = zodiacData;
  }
  return FileUtils.writeHoroscopeFile(horoscopes,"horoscope.json");
}

module.exports = {
  start,
};
