const cheerio = require("cheerio");
const axios = require("axios");
const FileUtils = require("../utils/fileUtils");

const url = "https://thehimalayantimes.com/category/horoscopes";
async function scrapeHimalayan() {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const horoscopes = $(".horoscopes");
  const data = [];
  $(horoscopes)
    .find("a")
    .each(function (i, elem) {
      const temp = {
        name: $(this).attr("title").split("(")[0],
        range: "(" + $(this).attr("title").split("(")[1],
        url: $(this).attr("href"),
      };
      data.push(temp);
    });
  return data;
}

async function scrapeHimalayanData(horoscope) {
  const response = await axios.get(horoscope.url);
  const $ = cheerio.load(response.data);

  const horoscopeData = $(".sign_detail").find("p").text();
  return horoscopeData;
}

async function start() {
  const horoscopes = await scrapeHimalayan();
  for (const horoscope of horoscopes) {
    const zodiacData = await scrapeHimalayanData(horoscope);
    horoscope["horoscope"] = zodiacData;
  }
  return FileUtils.writeHoroscopeFile(horoscopes, "himalayan.json");
}

module.exports = {
  start,
};
