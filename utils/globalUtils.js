const w3cApiUtils = require("../utils/w3cApiUtils");

module.exports.checkBattleTag = function(battleTag) {
  return battleTag.match(/[a-zA-Z0-9]+#{1}[0-9]+/gm);
};

module.exports.findClanMembers = function(clanMembers, battleTag) {
  return clanMembers.find(p => {
    return p.battleTag === battleTag;
  });
};

module.exports.stat1v1vsPlayer = async function(player1, player2) {
  const historyResult = await w3cApiUtils.getHistoryMatchVersusOpponent1v1(
    player1.battleTag,
    player2.battleTag
  );
  if (historyResult && historyResult.count >= 1) {
    let total = historyResult.count;
    let winCounter = 0;
    for (let match of historyResult.matches) {
      winCounter +=
        (match.teams[0].players[0].won &&
          match.teams[0].players[0].battleTag === player1.battleTag) ||
        (match.teams[1].players[0].won &&
          match.teams[1].players[0].battleTag === player1.battleTag)
          ? 1
          : 0;
      return {
        player1Name: player1.name,
        player1Battletag: player1.battleTag,
        player2Name: player2.name,
        player2Battletag: player2.battleTag,
        win: total && total > 0 ? winCounter : 0,
        loose: total && total > 0 ? total - winCounter : 0,
        rate: total && total > 0 ? Math.round((winCounter / total) * 100) : 0
      };
    }
  } else {
    return undefined;
  }
};
