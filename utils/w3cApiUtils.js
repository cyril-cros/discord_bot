const axios = require("axios");
const w3cApiUrl = `https://statistic-service.w3champions.com/api`;

// https://statistic-service.w3champions.com/api/players/Chef%2321383/race-stats?gateWay=20&season=1
// {"battleTag":"Chef#21383","name":"Chef","participatedInSeasons":[{"id":1},{"id":0}],"winLosses":[{"race":1,"wins":0,"losses":2,"games":2,"winrate":0},{"race":2,"wins":3,"losses":2,"games":5,"winrate":0.6},{"race":4,"wins":0,"losses":0,"games":0,"winrate":0},{"race":8,"wins":39,"losses":37,"games":76,"winrate":0.5131578947368421},{"race":0,"wins":0,"losses":0,"games":0,"winrate":0}]}
module.exports.getPlayerStatsByRace = async function(battleTag) {
  let splitResult = battleTag.split("#");
  let response = await axios.get(
    `${w3cApiUrl}/players/${splitResult[0]}%23${splitResult[1]}/race-stats?gateWay=20&season=1`
  );

  return response && response.data ? response.data : {};
};

// https://statistic-service.w3champions.com/api/players/Chef%2321383/game-mode-stats?gateWay=20&season=1
// [{"gameMode":1,"gateWay":20,"playerIds":[{"name":"Chef","battleTag":"Chef#21383"}],"season":1,"id":"1_Chef#21383@20_GM_1v1","mmr":1424,"rankingPoints":4730,"rank":88,"leagueId":19,"leagueOrder":4,"division":2,"rankingPointsProgress":{"rankingPoints":125,"mmr":25},"wins":32,"losses":29,"games":61,"winrate":0.5245901639344263},{"gameMode":6,"gateWay":20,"playerIds":[{"name":"Chef","battleTag":"Chef#21383"},{"name":"RastaEwOk","battleTag":"RastaEwOk#2777"}],"season":1,"id":"1_Chef#21383@20_RastaEwOk#2777@20_GM_2v2_AT","mmr":1415,"rankingPoints":4246,"rank":0,"leagueId":0,"leagueOrder":0,"division":0,"rankingPointsProgress":{"rankingPoints":0,"mmr":0},"wins":0,"losses":1,"games":1,"winrate":0},{"gameMode":6,"gateWay":20,"playerIds":[{"name":"Chef","battleTag":"Chef#21383"},{"name":"blue","battleTag":"blue#2580"}],"season":1,"id":"1_blue#2580@20_Chef#21383@20_GM_2v2_AT","mmr":1541,"rankingPoints":4777,"rank":50,"leagueId":6,"leagueOrder":4,"division":1,"rankingPointsProgress":{"rankingPoints":0,"mmr":0},"wins":10,"losses":11,"games":21,"winrate":0.47619047619047616}]
module.exports.getPlayerGameModeStat = async function(battleTag) {
  let splitResult = battleTag.split("#");
  let response = await axios.get(
    `${w3cApiUrl}/players/${splitResult[0]}%23${splitResult[1]}/game-mode-stats?gateWay=20&season=1`
  );

  return response && response.data ? response.data : {};
};

// https://statistic-service.w3champions.com/api/matches/search?playerId=Chef%2321383&gateway=20&offset=0&opponentId=Positrone%232577&pageSize=50&gameMode=1&season=1
module.exports.getHistoryMatchVersusOpponent1v1 = async function(
  myBattleTag,
  oppBattleTag
) {
  let splitMyBattleTag = myBattleTag.split("#");
  let splitOppBattleTag = oppBattleTag.split("#");
  let response = await axios.get(
    `${w3cApiUrl}/matches/search?playerId=${splitMyBattleTag[0]}%23${splitMyBattleTag[1]}&gateway=20&offset=0&opponentId=${splitOppBattleTag[0]}%23${splitOppBattleTag[1]}&pageSize=50&gameMode=1&season=1`
  );

  return response && response.data ? response.data : {};
};

//https://statistic-service.w3champions.com/api/matches/ongoing/Minipapam%232239
// {"map":"amazonia","id":"5efb73bc4521d79a292ee28f","durationInSeconds":0,"startTime":"2020-06-30T17:17:32.803+00:00","endTime":"0001-01-01T00:00:00+00:00","gameMode":1,"teams":[{"players":[{"race":8,"oldMmr":1596,"currentMmr":0,"battleTag":"Minipapam#2239","name":"Minipapam","mmrGain":-1596,"won":false}],"won":false},{"players":[{"race":2,"oldMmr":1505,"currentMmr":0,"battleTag":"Jnk#21150","name":"Jnk","mmrGain":-1505,"won":false}],"won":false}],"gateWay":20,"season":0}
module.exports.getPlayerOngoingMatch = async function(battleTag) {
  let splitResult = battleTag.split("#");
  let response = await axios.get(
    `${w3cApiUrl}/matches/ongoing/${splitResult[0]}%23${splitResult[1]}`
  );

  return response && response.data ? response.data : {};
};

// https://statistic-service.w3champions.com/api/ladder/league-constellation?season=1
module.exports.getLeagues = async function() {
  let response = await axios.get(
    `${w3cApiUrl}/ladder/league-constellation?season=1`
  );

  return response && response.data ? response.data : {};
};

// https://statistic-service.w3champions.com/api/players/Chef%2321383
module.exports.getPlayerGlobalInformation = async function(battleTag) {
  let splitResult = battleTag.split("#");
  let response = await axios.get(
    `${w3cApiUrl}/players/${splitResult[0]}%23${splitResult[1]}`
  );

  return response && response.data ? response.data : {};
};
