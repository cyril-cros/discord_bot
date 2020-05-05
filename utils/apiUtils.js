const axios = require("axios");
const w3cApiUrl = `https://api.w3champions.com`;

async function getPlayerStats(player) {
  let response = await axios.get(
    `${w3cApiUrl}/player/${player.pseudo}%23${player.tag}/stats`
  );
  return formatPlayerData(response);
}

async function getPlayerStatsByBattleTag(battleTag) {
  let splitResult = battleTag.split("#");

  let response = await axios.get(
    `${w3cApiUrl}/player/${splitResult[0]}%23${splitResult[1]}/stats`
  );

  return formatPlayerData(response);
}

async function getLeague1to1() {
  let response = await axios.get(`${w3cApiUrl}/leagues/20/1`);

  return refactorLeague(response);
}
async function getLeague2to2AT() {
  let response = await axios.get(`${w3cApiUrl}/leagues/20/6`);

  return refactorLeague(response);
}

function refactorLeague(response) {
  let rankCounter = 0;
  let leagues = {};

  if (response && response.data) {
    leagues = response.data;
    leagues.map(league => {
      league.from = rankCounter + 1;
      league.to = rankCounter + league.maxParticipantCount;
      rankCounter += league.maxParticipantCount;
    });
  }
  return leagues;
}

async function getPlayersMatchesHistoryByBattleTag(battleTag) {
  let splitResult = battleTag.split("#");

  let matches = {};

  let response = await axios.get(
    `${w3cApiUrl}/player/${splitResult[0]}%23${splitResult[1]}/match?limit=1000&offset=0`
  );
  if (response && response.data && response.data.items) {
    matches = response.data.items;
  }

  return matches;
}

function formatPlayerData(response) {
  if (response && response.data && response.data.data) {
    let playerStat = response.data.data;
    return {
      pseudo: response.data.account.split("#")[0],
      winlosseSolo: `${playerStat.ladder[20].solo.wins}/${playerStat.ladder[20].solo.losses}`,
      winlosseRatioSolo: `${Math.round(
        (playerStat.ladder[20].solo.wins /
          (playerStat.ladder[20].solo.losses +
            playerStat.ladder[20].solo.wins)) *
          100
      )} %`,
      rp: Math.round(playerStat.ladder[20].solo.ranking.rp),
      mmr: Math.round(playerStat.ladder[20].solo.mmr.rating),
      leagueId: playerStat.ladder[20].solo.ranking.leagueId,
      league: `${
        playerStat.ladder[20].solo.league
          ? playerStat.ladder[20].solo.league.name
          : "Noob League"
      } - ${
        playerStat.ladder[20].solo.league
          ? playerStat.ladder[20].solo.league.division
          : "N/A"
      }`,
      leagueRank: playerStat.ladder[20].solo.ranking.rank,
      stats: playerStat.stats
    };
  } else {
    return {};
  }
}

module.exports.getPlayers = getPlayerStats;
module.exports.getPLayersMatchesHistoryByBattleTag = getPlayersMatchesHistoryByBattleTag;
module.exports.getLeague1to1 = getLeague1to1;
module.exports.getLeague2to2AT = getLeague2to2AT;
module.exports.getPlayerStatsByBattleTag = getPlayerStatsByBattleTag;
