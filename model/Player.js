const globalUtils = require("../utils/globalUtils");

module.exports.Player = class {
  battleTag;
  pseudo;
  tag;
  statsGlobal;
  statsSolo;
  statsArrangedTeam2;
  isClanMember;

  constructor(w3cPlayerStats, clanPlayers, leagues) {
    this.battleTag = w3cPlayerStats.account;
    this.isClanMember = !!globalUtils.findClanMembers(
      clanPlayers,
      w3cPlayerStats.account
    );
    const splitBattleTag = w3cPlayerStats.account.split("#");
    this.pseudo = splitBattleTag[0];
    this.tag = splitBattleTag[1];
    this.statsGlobal = {};
    this.mapStatsGlobal(w3cPlayerStats.data.stats);
    this.statsSolo = {};
    this.mapStatsSolo(w3cPlayerStats.data.ladder[20].solo, leagues.solo);
    this.statsArrangedTeam2 = {};
    this.mapStatsArrangedTeam2(
      w3cPlayerStats.data.ladder[6],
      leagues.arrangerTeam2
    );
  }

  mapStatsGlobal(w3cStatsGlobal) {
    // ## human Global Stats
    this.statsGlobal.human = {};
    this.statsGlobal.human.wins = w3cStatsGlobal.human.wins;
    this.statsGlobal.human.losses = w3cStatsGlobal.human.losses;
    this.statsGlobal.human.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.human.wins,
      w3cStatsGlobal.human.losses
    );
    this.statsGlobal.human.ratio = this.calculateWinrate(
      w3cStatsGlobal.human.wins,
      w3cStatsGlobal.human.losses
    );
    // ## orc Global Stats
    this.statsGlobal.orc = {};
    this.statsGlobal.orc.wins = w3cStatsGlobal.orc.wins;
    this.statsGlobal.orc.losses = w3cStatsGlobal.orc.losses;
    this.statsGlobal.orc.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.orc.wins,
      w3cStatsGlobal.orc.losses
    );
    this.statsGlobal.orc.ratio = this.calculateWinrate(
      w3cStatsGlobal.orc.wins,
      w3cStatsGlobal.orc.losses
    );
    // ## undead Global Stats
    this.statsGlobal.undead = {};
    this.statsGlobal.undead.wins = w3cStatsGlobal.undead.wins;
    this.statsGlobal.undead.losses = w3cStatsGlobal.undead.losses;
    this.statsGlobal.undead.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.undead.wins,
      w3cStatsGlobal.undead.losses
    );
    this.statsGlobal.undead.ratio = this.calculateWinrate(
      w3cStatsGlobal.undead.wins,
      w3cStatsGlobal.undead.losses
    );
    // ## night_elf Global Stats
    this.statsGlobal.night_elf = {};
    this.statsGlobal.night_elf.wins = w3cStatsGlobal.night_elf.wins;
    this.statsGlobal.night_elf.losses = w3cStatsGlobal.night_elf.losses;
    this.statsGlobal.night_elf.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.night_elf.wins,
      w3cStatsGlobal.night_elf.losses
    );
    this.statsGlobal.night_elf.ratio = this.calculateWinrate(
      w3cStatsGlobal.night_elf.wins,
      w3cStatsGlobal.night_elf.losses
    );
    // ## random Global Stats
    this.statsGlobal.random = {};
    this.statsGlobal.random.wins = w3cStatsGlobal.random.wins;
    this.statsGlobal.random.losses = w3cStatsGlobal.random.losses;
    this.statsGlobal.random.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.random.wins,
      w3cStatsGlobal.random.losses
    );
    this.statsGlobal.random.ratio = this.calculateWinrate(
      w3cStatsGlobal.random.wins,
      w3cStatsGlobal.random.losses
    );
    // ## Human Global Stats
    this.statsGlobal.total = {};
    this.statsGlobal.total.wins = w3cStatsGlobal.total.wins;
    this.statsGlobal.total.losses = w3cStatsGlobal.total.losses;
    this.statsGlobal.total.hasEverPlayed = this.calculateHasEverPlayed(
      w3cStatsGlobal.total.wins,
      w3cStatsGlobal.total.losses
    );
    this.statsGlobal.total.ratio = this.calculateWinrate(
      w3cStatsGlobal.total.wins,
      w3cStatsGlobal.total.losses
    );
  }

  mapStatsSolo(w3cStatsSolo, leagueSolo = {}) {
    // ### statsSolo.mmr
    this.vstatsSolo.mmr = {};
    this.statsSolo.mmr.rating = Math.round(w3cStatsSolo.mmr.rating);
    this.statsSolo.mmr.rd = w3cStatsSolo.mmr.rd;
    this.statsSolo.mmr.vol = w3cStatsSolo.mmr.vol;

    // ### statsSolo.ranking
    this.statsSolo.ranking = {};
    this.statsSolo.ranking.progress = w3cStatsSolo.ranking.progress;
    this.statsSolo.ranking.rp = Math.round(w3cStatsSolo.ranking.rp);
    this.statsSolo.ranking.lastGame = w3cStatsSolo.ranking.lastGame;
    this.statsSolo.ranking.globalRank = this.calculateLeagueGlobalRank(
      leagueSolo,
      w3cStatsSolo.ranking.leagueId,
      w3cStatsSolo.ranking.rank
    );
    this.statsSolo.ranking.league = {};
    if (
      w3cStatsSolo.ranking.leagueId !== undefined &&
      w3cStatsSolo.league !== undefined
    ) {
      this.statsSolo.ranking.league.id = w3cStatsSolo.ranking.leagueId;
      this.statsSolo.ranking.league.name = w3cStatsSolo.league.name;
      this.statsSolo.ranking.league.order = w3cStatsSolo.league.order;
      this.statsSolo.ranking.league.division = w3cStatsSolo.league.division;
      this.statsSolo.ranking.league.rank = w3cStatsSolo.ranking.rank;
    }

    // #### statsSolo wins & losses
    this.statsSolo.winrate = {};
    this.statsSolo.winrate.wins = w3cStatsSolo.wins;
    this.statsSolo.winrate.losses = w3cStatsSolo.losses;
    this.statsSolo.winrate.ratio = this.calculateWinrate(
      w3cStatsSolo.wins,
      w3cStatsSolo.losses
    );
  }

  mapStatsArrangedTeam2(w3cStatsArrangedTeam2, leagueArrangedTeam2 = {}) {
    // #### statsSolo wins & losses
    this.statsArrangedTeam2.winrate = {};
    this.statsArrangedTeam2.winrate.wins = w3cStatsArrangedTeam2.wins;
    this.statsArrangedTeam2.winrate.losses = w3cStatsArrangedTeam2.losses;
    this.statsArrangedTeam2.winrate.ratio = this.calculateWinrate(
      w3cStatsArrangedTeam2.wins,
      w3cStatsArrangedTeam2.losses
    );
  }

  calculateWinrate(wins, losses) {
    return Math.round((wins / (wins + losses)) * 100);
  }

  calculateHasEverPlayed(wins, losses) {
    return wins + losses > 0;
  }

  calculateLeagueGlobalRank(
    league,
    playerLeagueId = null,
    playerRankInDivision
  ) {
    return league !== {} && league[playerLeagueId]
      ? league[playerLeagueId].from - 1 + playerRankInDivision
      : 9999999;
  }
};
