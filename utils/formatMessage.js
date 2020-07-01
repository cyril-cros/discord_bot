const CR = `\n`;

module.exports.getClanName = function(clanName) {
  let output = ``;
  for (const letter of clanName.toLowerCase()) {
    output += `:regional_indicator_${letter}: `;
  }

  return output;
};

module.exports.formatSinglePlayerStats = function(player) {
  let outputStr = ``;
  let iconIsClanMember = player.isClanMember ? `:bear:` : `:japanese_goblin:`;

  outputStr += `${CR}${iconIsClanMember} - Stats of - **${player.pseudo} (${player.battleTag})**${CR}`;
  outputStr += `${iconIsClanMember} - **Global (All races)**  - [Win rate ${player.statsGlobal.total.wins}/${player.statsGlobal.total.losses} (${player.statsGlobal.total.ratio}%)]${CR}`;
  player.statsGlobal.human.hasEverPlayed
    ? (outputStr += `------------>Global (Human)    - ${player.statsGlobal.human.wins}/${player.statsGlobal.human.losses} (${player.statsGlobal.human.ratio}%)${CR}`)
    : ``;

  player.statsGlobal.orc.hasEverPlayed
    ? (outputStr += `------------>Global (Orc)          - ${player.statsGlobal.orc.wins}/${player.statsGlobal.orc.losses} (${player.statsGlobal.orc.ratio}%)${CR}`)
    : ``;

  player.statsGlobal.undead.hasEverPlayed
    ? (outputStr += `------------>Global (Undead)   - ${player.statsGlobal.undead.wins}/${player.statsGlobal.undead.losses} (${player.statsGlobal.undead.ratio}%)${CR}`)
    : ``;

  player.statsGlobal.night_elf.hasEverPlayed
    ? (outputStr += `------------>Global (Night Elf)  - ${player.statsGlobal.night_elf.wins}/${player.statsGlobal.night_elf.losses} (${player.statsGlobal.night_elf.ratio}%)${CR}`)
    : ``;

  player.statsGlobal.random.hasEverPlayed
    ? (outputStr += `------------>Global (Random)   - ${player.statsGlobal.random.wins}/${player.statsGlobal.random.losses} (${player.statsGlobal.random.ratio}%)${CR}`)
    : ``;

  outputStr += `${iconIsClanMember} - **SOLO**   - [Global Rank #${player.statsSolo.ranking.globalRank}] [Win rate ${player.statsSolo.winrate.wins}/${player.statsSolo.winrate.losses} (${player.statsSolo.winrate.ratio}%)] [League - ${player.statsSolo.ranking.league.name} ${player.statsSolo.ranking.league.division} #${player.statsSolo.ranking.league.rank}] -rp=${player.statsSolo.ranking.rp} -mmr=${player.statsSolo.mmr.rating}${CR}`;
  outputStr += `${iconIsClanMember} - **AT 2v2** - [Global Rank #N/A] [Win rate ${player.statsArrangedTeam2.winrate.wins}/${player.statsArrangedTeam2.winrate.losses} (${player.statsArrangedTeam2.winrate.ratio}%)] [League - N/A ] -rp=N/A -mmr=N/A${CR}`;

  return outputStr;
};

module.exports.formatSinglePlayerStats = function(player) {
  let outputStr = ``;
  let iconIsClanMember = player.isClanMember ? `:bear:` : `:japanese_goblin:`;
  outputStr += `${CR}${iconIsClanMember} - Stats of - **${player.name} (${player.battleTag})**${CR}`;
  outputStr += `**Stats by Races**${CR}`;
  if (player.raceStats.human) {
    outputStr += `Human  - ${player.raceStats.human.wins} / ${player.raceStats.human.losses} (${player.raceStats.human.winrateLabel})${CR}`;
  }
  if (player.raceStats.orc) {
    outputStr += `Orc  - ${player.raceStats.orc.wins} / ${player.raceStats.orc.losses} (${player.raceStats.orc.winrateLabel})${CR}`;
  }
  if (player.raceStats.nightelf) {
    outputStr += `Night Elf  - ${player.raceStats.nightelf.wins} / ${player.raceStats.nightelf.losses} (${player.raceStats.nightelf.winrateLabel})${CR}`;
  }
  if (player.raceStats.undead) {
    outputStr += `Undead - ${player.raceStats.undead.wins} / ${player.raceStats.undead.losses} (${player.raceStats.undead.winrateLabel})${CR}`;
  }
  if (player.raceStats.random) {
    outputStr += `Random - ${player.raceStats.random.wins} / ${player.raceStats.random.losses} (${player.raceStats.random.winrateLabel})${CR}`;
  }
  outputStr += `${CR}**Stats by Game Mode**${CR}`;
  for (let stat of player.gameModeStats) {
    outputStr += `${stat.gameModeLabel} (${stat.leagueLabel} ${stat.division}) - ${stat.wins} / ${stat.losses} (${stat.winrateLabel})${CR}`;
  }

  return outputStr;
};
