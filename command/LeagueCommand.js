const getClanName = require("../utils/formatMessage").getClanName;
const apiUtils = require("../utils/apiUtils");

class LeagueCommand {
  command;
  usage;
  description;
  clanName;

  constructor(botName, clanName) {
    this.command = `leagues`;
    this.usage = `${botName}!${this.command} ##==> Provides insight on all W3C leagues
${botName}!${this.command} 1to1 ##==> Provides insight on W3C leagues 1to1
${botName}!${this.command} 2to2AT ##==> Provides insight on W3C leagues Arranged team 2t2\n\n`;
    this.description = `Provides insight on W3C leagues`;
    this.clanName = clanName;
  }

  async execute(argumentList) {
    let outputStr = `${getClanName(
      this.clanName
    )} Provides insight on W3C leagues: \n`;

    switch (argumentList[0]) {
      case "1to1":
        await getLeague1to1Info();
        break;
      case "2to2AT":
        await getLeague2to2AT();
        break;
      default:
        await getLeague1to1Info();
        await getLeague2to2AT();
        break;
    }

    async function getLeague2to2AT() {
      outputStr += `\nLEAGUE ARRANGED TEAM 2to2\n`;

      let league2to2AT = await apiUtils.getLeague2to2AT();

      league2to2AT.forEach(league => {
        outputStr += `${league.id} - ${league.name} - ${league.division} - From rank ${league.from} to ${league.to} \n`;
      });
    }
    async function getLeague1to1Info() {
      outputStr += `LEAGUE 1 to 1\n`;
      let league1to1 = await apiUtils.getLeague1to1();

      league1to1.forEach(league => {
        outputStr += `${league.id} - ${league.name} - ${league.division} - From rank ${league.from} to ${league.to} \n`;
      });
    }

    return outputStr;
  }
}

module.exports = LeagueCommand;
