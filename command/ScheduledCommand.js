const getClanName = require("../utils/formatMessage").getClanName;
const W3cPlayer = require("../model/W3cPlayer").W3cPlayer;
const globalUtils = require("../utils/globalUtils");
const w3cApiUtils = require("../utils/w3cApiUtils");
const fileUtils = require("../utils/fileUtils");
const formatMessageUtils = require("../utils/formatMessage");

class ScheduledCommand {
  command;
  usage;
  description;
  clanName;
  onGoingMatchToBlacklist;

  constructor(botName, clanName) {
    this.command = `scheduled`;
    this.clanName = clanName;
    this.onGoingMatchToBlacklist = [];
    this.usage = ``;
  }
  async execute(fullCommand, argumentList) {
    let outputStr = ``;

    try {
      let clanMembers = await fileUtils.getPlayers();
      for (let clanMember of clanMembers) {
        const onGoingMatch = await w3cApiUtils.getPlayerOngoingMatch(
          clanMember.battleTag
        );
        // For now we only aim to follow Solo matches
        if (
          onGoingMatch &&
          onGoingMatch.gameMode === 1 &&
          (argumentList &&
            this.onGoingMatchToBlacklist.indexOf(onGoingMatch.id)) < 0
        ) {
          outputStr += `${getClanName(this.clanName)} - ${fullCommand} \n`;

          this.onGoingMatchToBlacklist.push(onGoingMatch.id);
          const opponent =
            onGoingMatch.teams[0].players[0].battleTag === clanMember.battleTag
              ? onGoingMatch.teams[1].players[0]
              : onGoingMatch.teams[0].players[0];

          // Get Opponent stats
          const opponentPlayer = new W3cPlayer(opponent.battleTag);
          await opponentPlayer.initPlayer();

          outputStr += `:bear: ${clanMember.name} (${clanMember.battleTag}) VS  :japanese_goblin: ${opponentPlayer.name} (${opponentPlayer.battleTag})\n`;

          // Get Opponent Clan history
          outputStr += formatMessageUtils.formatSinglePlayerStats(
            opponentPlayer
          );
          let playedAgainstClanCounter = 0;
          outputStr += `\n**Stats against Clan ${this.clanName}**\n`;
          for (let cm of clanMembers) {
            const historyResult = await globalUtils.stat1v1vsPlayer(
              cm,
              opponent
            );
            if (historyResult) {
              playedAgainstClanCounter++;
              outputStr += `:bear: ${historyResult.player1.name} (${historyResult.player1.battleTag}) - ${historyResult.win} / ${historyResult.loose} (${historyResult.rate}%)\n`;
            }
          }
          if (playedAgainstClanCounter === 0) {
            outputStr += `**Never played against Clan ${this.clanName}**\n`;
          }
        }
      }
    } catch (error) {
      outputStr += `\n:interrobang: - ERROR - Unexpected error => ${error}`;
    }

    return outputStr;
  }
}

module.exports = ScheduledCommand;
