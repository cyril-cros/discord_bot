const getClanName = require("../utils/formatMessage").getClanName;
const W3cPlayer = require("../model/W3cPlayer").W3cPlayer;
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
    let outputStr = `${getClanName(this.clanName)} - ${fullCommand}\n`;
    try {
      if (argumentList) {
        let player1BattleTag = argumentList[0];
        switch (argumentList.length) {
          // Retrieve stats of a player
          case 1:
            let player = new W3cPlayer(player1BattleTag);
            await player.initPlayer();
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
                  // Get Opponent stats
                  const opponentPlayer = new W3cPlayer(player1BattleTag);
                  await opponentPlayer.initPlayer();

                  outputStr += `:bear: ${opponentPlayer.name} (${opponentPlayer.battleTag}) VS  ${this.clanName} Clan players:\n`;
                  outputStr += formatMessageUtils.formatSinglePlayerStats(
                    opponentPlayer
                  );
                  let clanMembers = await fileUtils.getPlayers();
                  let playedAgainstClanCounter = 0;
                  outputStr += `\n**Stats against Clan ${this.clanName}**\n`;
                  for (let cm of clanMembers) {
                    const historyResult = await globalUtils.stat1v1vsPlayer(
                      cm,
                      opponentPlayer
                    );
                    if (historyResult) {
                      playedAgainstClanCounter++;
                      outputStr += `:bear: ${historyResult.player1Name} (${historyResult.player1Battletag}) - ${historyResult.win} / ${historyResult.loose} (${historyResult.rate}%)\n`;
                    }
                  }
                  if (playedAgainstClanCounter === 0) {
                    outputStr += `**Never played against Clan ${this.clanName}**\n`;
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
