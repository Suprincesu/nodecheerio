const fs = require("fs");

function readHoroscopeFile(fileName) {
  const horoscopes = fs.readFileSync(fileName);
  return JSON.parse(horoscopes);
}

function writeHoroscopeFile(data,fileName) {
  const stringData = JSON.stringify(data);
  fs.writeFileSync(fileName, stringData);
  return "Scrapping completed";
}

module.exports = {
  readHoroscopeFile,
  writeHoroscopeFile,
};
