const w3cApi = require("../utils/w3cApiUtils");
const fileUtils = require("../utils/fileUtils");

module.exports.W3cPlayer = class {
  name;
  battleTag;
  isClanMember;
  gameModeStats;
  raceStats;

  constructor(battleTag) {
    this.battleTag = battleTag;
  }

  async initPlayer() {
    this.isClanMember = await this.getClanInfo();
    this.name = await this.getGlobalInfo();
    let leagues = await this.getLeagues();
    this.gameModeStats = await this.buildGameModeStats(leagues);
    this.raceStats = await this.buildRaceStats();
  }

  async getClanInfo() {
    const clanMembers = await fileUtils.getPlayers();
    const result = clanMembers.find(e => e.battleTag === this.battleTag);
    return result !== undefined;
  }

  async getGlobalInfo() {
    let name = "";
    try {
      const result = await w3cApi.getPlayerGlobalInformation(this.battleTag);
      name = result ? result.name : "";
    } catch (error) {
      console.log(error);
      return "";
    }
    return name;
  }

  async getLeagues() {
    let leagues = {};
    try {
      const result = await w3cApi.getLeagues();
      leagues = result ? result : {};
    } catch (error) {
      console.log(error);
      return {};
    }
    return leagues;
  }

  async buildGameModeStats(leagues) {
    let gameModeStats = [];
    try {
      const result = await w3cApi.getPlayerGameModeStat(this.battleTag);
      if (result) {
        for (let r of result) {
          let gameModeStat = {};
          gameModeStat.gameModeId = r.gameMode;
          switch (r.gameMode) {
            case 1:
              gameModeStat.gameModeLabel = "1V1";
              break;
            case 2:
              gameModeStat.gameModeLabel = "2V2";
              break;
            case 3:
              gameModeStat.gameModeLabel = "3V3";
              break;
            case 4:
              gameModeStat.gameModeLabel = "4V4";
              break;
            case 5:
              gameModeStat.gameModeLabel = "FFA";
              break;
            case 6:
              gameModeStat.gameModeLabel = "2v2 AT";
              break;
            case 7:
              gameModeStat.gameModeLabel = "3v3 AT";
              break;
            case 8:
              gameModeStat.gameModeLabel = "4v4 AT";
              break;
            default:
              gameModeStat.gameModeLabel = "Unknown";
              break;
          }
          gameModeStat.gateWay = r.gateWay;
          gameModeStat.playerId = r.id;
          gameModeStat.playerIds = r.playerIds;
          gameModeStat.season = r.season;
          gameModeStat.mmr = r.mmr;
          gameModeStat.rankingPoints = r.rankingPoints;
          gameModeStat.rank = r.rank;
          gameModeStat.leagueId = r.leagueId;
          gameModeStat.leagueLabel = this.matchLeagueLabel(
            r.gameMode,
            r.leagueId,
            r.division,
            leagues
          ).name;
          gameModeStat.leagueOrder = r.leagueOrder;
          gameModeStat.division = r.division;
          gameModeStat.rankingPointsProgress = r.rankingPointsProgress;
          gameModeStat.wins = r.wins;
          gameModeStat.losses = r.losses;
          gameModeStat.totalGames = r.games;
          gameModeStat.winrate = r.winrate;
          gameModeStat.winrateLabel = Math.round(r.winrate * 100) + "%";
          gameModeStats.push(gameModeStat);
        }
      }
    } catch (error) {
      console.log(error);
      return {};
    }
    return gameModeStats;
  }

  matchLeagueLabel(gameModeId, leagueId, divisionId, leagues) {
    let league = {};
    let leagueForSelectedGameMode = leagues.find(
      e => e.gameMode === gameModeId
    );
    if (
      leagueForSelectedGameMode &&
      leagueForSelectedGameMode.leagues &&
      leagueForSelectedGameMode.leagues.length >= 1
    ) {
      let leagueResult = leagueForSelectedGameMode.leagues.find(
        e => e.id === leagueId && e.division === divisionId
      );
      league = leagueResult
        ? leagueResult
        : { division: divisionId, id: leagueId, name: "Unknown", order: 0 };
    }
    return league;
  }

  async buildRaceStats() {
    let raceStats = {};
    try {
      const result = await w3cApi.getPlayerStatsByRace(this.battleTag);
      if (result) {
        for (let stats of result) {
          switch (stats.race) {
            case 1:
              raceStats.human = {};
              raceStats.human.raceId = 1;
              raceStats.human.raceLabel = "Human";
              raceStats.human.gateWay = stats.gateWay;
              raceStats.human.season = stats.season;
              raceStats.human.playerId = stats.id;
              raceStats.human.wins = stats.wins;
              raceStats.human.losses = stats.losses;
              raceStats.human.totalGames = stats.games;
              raceStats.human.winrate = stats.winrate;
              raceStats.human.winrateLabel =
                Math.round(stats.winrate * 100) + "%";
              break;
            case 2:
              raceStats.orc = {};
              raceStats.orc.raceId = 2;
              raceStats.orc.raceLabel = "Orc";
              raceStats.orc.gateWay = stats.gateWay;
              raceStats.orc.season = stats.season;
              raceStats.orc.playerId = stats.id;
              raceStats.orc.wins = stats.wins;
              raceStats.orc.losses = stats.losses;
              raceStats.orc.totalGames = stats.games;
              raceStats.orc.winrate = stats.winrate;
              raceStats.orc.winrateLabel =
                Math.round(stats.winrate * 100) + "%";
              break;
            case 4:
              raceStats.nightelf = {};
              raceStats.nightelf.raceId = 4;
              raceStats.nightelf.raceLabel = "Night Elf";
              raceStats.nightelf.gateWay = stats.gateWay;
              raceStats.nightelf.season = stats.season;
              raceStats.nightelf.playerId = stats.id;
              raceStats.nightelf.wins = stats.wins;
              raceStats.nightelf.losses = stats.losses;
              raceStats.nightelf.totalGames = stats.games;
              raceStats.nightelf.winrate = stats.winrate;
              raceStats.nightelf.winrateLabel =
                Math.round(stats.winrate * 100) + "%";
              break;
            case 8:
              raceStats.undead = {};
              raceStats.undead.raceId = 8;
              raceStats.undead.raceLabel = "Undead";
              raceStats.undead.gateWay = stats.gateWay;
              raceStats.undead.season = stats.season;
              raceStats.undead.playerId = stats.id;
              raceStats.undead.wins = stats.wins;
              raceStats.undead.losses = stats.losses;
              raceStats.undead.totalGames = stats.games;
              raceStats.undead.winrate = stats.winrate;
              raceStats.undead.winrateLabel =
                Math.round(stats.winrate * 100) + "%";
              break;
            case 0:
              raceStats.random = {};
              raceStats.random.raceId = 0;
              raceStats.random.raceLabel = "Undead";
              raceStats.random.gateWay = stats.gateWay;
              raceStats.random.season = stats.season;
              raceStats.random.playerId = stats.id;
              raceStats.random.wins = stats.wins;
              raceStats.random.losses = stats.losses;
              raceStats.random.totalGames = stats.games;
              raceStats.random.winrate = stats.winrate;
              raceStats.random.winrateLabel =
                Math.round(stats.winrate * 100) + "%";
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      console.log(error);
      return {};
    }
    return raceStats;
  }
};
