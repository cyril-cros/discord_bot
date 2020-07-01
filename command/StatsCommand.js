const getClanName = require("../utils/formatMessage").getClanName;
const globalUtils = require("../utils/globalUtils");
const apiUtils = require("../utils/apiUtils");
const fileUtils = require("../utils/fileUtils");
const formatMessageUtils = require("../utils/formatMessage");

class StatsCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `stats`;
    this.clanName = clanName;
    this.usage = `${botName}!${this.command} PLAYER_BATTLETAG ##==> Shows player stats
${botName}!${this.command} PLAYER_BATTLETAG VS ${this.clanName} ##==> Shows player stats against ${this.clanName} Clan players
${botName}!${this.command} PLAYER_BATTLETAG_1 VS PLAYER_BATTLETAG_2 ##==> Shows player stats against PLAYER_BATTLETAG_2 player \n\n`;
    this.description = `Shows player stats`;
  }

  async execute(fullCommand, argumentList) {
    let outputStr = `${getClanName(this.clanName)} - ${fullCommand}`;
    try {
      if (argumentList) {
        let player1BattleTag = argumentList[0];
        switch (argumentList.length) {
          // Retrieve stats of a player
          case 1:
            let player = await apiUtils.getPlayerObj(player1BattleTag);
            if (player && player.battleTag !== undefined) {
              outputStr += formatMessageUtils.formatSinglePlayerStats(player);
            } else {
              outputStr += `:interrobang: - ERROR - Player not found => ${player1BattleTag}`;
            }
            break;
          // compare stats between 1 player or a clan
          case 3:
            if (globalUtils.checkBattleTag(argumentList[0])) {
              if (argumentList[1].toUpperCase() === "VS") {
                if (
                  argumentList[2].toUpperCase() === this.clanName.toUpperCase()
                ) {
                  outputStr += ` Shows player stats against ${this.clanName} Clan players: \n\n`;

                  let matches = await apiUtils.getPLayersMatchesHistoryByBattleTag(
                    argumentList[0]
                  );
                  let clanPLayers = await fileUtils.getPlayers();

                  for (const clanPlayer of clanPLayers) {
                    let gameWon = 0;
                    let gameLost = 0;

                    for (const game of matches) {
                      if (game.players.length === 2) {
                        for (const player of game.players) {
                          if (
                            player.battleTag.toLowerCase() ===
                            clanPlayer.battleTag.toLowerCase()
                          ) {
                            player.won ? gameLost++ : gameWon++;
                          }
                        }
                      }
                    }

                    if (
                      clanPlayer.battleTag !== argumentList[0] &&
                      gameLost + gameWon > 0
                    ) {
                      outputStr += `${
                        clanPlayer.pseudo
                      } ${gameLost}/${gameWon} ${
                        argumentList[0]
                      }- (${Math.round(
                        (gameLost / (gameWon + gameLost)) * 100
                      )}) % \n`;
                    }
                  }
                } else {
                  if (globalUtils.checkBattleTag(argumentList[2])) {
                    outputStr += ` Shows player stats against ${argumentList[2]} player: \n\n`;
                    let matches = await apiUtils.getPLayersMatchesHistoryByBattleTag(
                      argumentList[0]
                    );

                    let gameWon = 0;
                    let gameLost = 0;

                    for (const game of matches) {
                      for (const player of game.players) {
                        if (
                          player.battleTag.toLowerCase() ===
                          argumentList[2].toLowerCase()
                        ) {
                          player.won ? gameLost++ : gameWon++;
                        }
                      }
                    }
                    outputStr += `${argumentList[0]} ${gameWon}/${gameLost} ${
                      argumentList[2]
                    }- (${Math.round(
                      (gameWon / (gameWon + gameLost)) * 100
                    )}) % \n`;
                  } else {
                    outputStr += `ERROR - Wrong battleTag in thrid argument: ${argumentList[2]}`;
                  }
                }
              } else {
                outputStr += `ERROR - Wrong keyword in second argument it should be VS`;
              }
            } else {
              outputStr += `ERROR - Wrong battleTag in first argument: ${argumentList[0]}`;
            }
            break;
          default:
            outputStr += `ERROR - Wrong number of arguments`;
            break;
        }
      } else {
        outputStr += `ERROR - This command requires arguments`;
      }
    } catch (error) {
      outputStr += `\n:interrobang: - ERROR - Unexpected error => ${error}`;
    }
    return outputStr;
  }
}

module.exports = StatsCommand;
