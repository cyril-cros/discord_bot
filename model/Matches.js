const globalUtils = require("../utils/globalUtils");

module.exports.Matches = class {
  playerBattleTag;
  isClanMember;
  pseudo;
  tag;
  soloMatches;
  arrangedTeam2Matches;
  constructor(playerBattleTag, clanPlayers, w3cMatches) {
    this.playerBattleTag = playerBattleTag;

    this.isClanMember = !!globalUtils.findClanMembers(
      clanPlayers,
      playerBattleTag
    );
    const splitBattleTag = playerBattleTag.account.split("#");
    this.pseudo = splitBattleTag[0];
    this.tag = splitBattleTag[1];

    this.soloMatches = {};
    this.arrangedTeam2Matches = {};
    this.mapMatches(w3cMatches);
  }
  mapMatches(w3cMatches) {
    this.soloMatches.resultAgainstClan = [];

    for (const match of w3cMatches) {
      switch (match.players.length) {
        // Solo match
        case 2:
          break;
        // Arranged Team 2v2
        case 4:
          break;
        default:
          break;
      }
    }
  }
};
