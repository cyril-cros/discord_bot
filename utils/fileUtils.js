const fs = require("fs");
const path = require("path");
const playerFilePath = path.join(__dirname, "../config/clanPlayers.json");

module.exports.getPlayers = async function() {
  return JSON.parse(fs.readFileSync(playerFilePath, "utf8"));
};

module.exports.setPlayers = async function(players) {
  fs.writeFile(playerFilePath, JSON.stringify(players), err => {});
};
