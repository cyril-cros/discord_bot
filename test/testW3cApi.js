const w3cApi = require("../utils/w3cApiUtils");

let assert = require("assert");

describe("W3C API testing", function() {
  describe("Endpoint => getHistoryMatchVersusOpponent1v1 (returns the historical matches of Opponent 1 vs Opponent 2)", function() {
    it("This usecase should return at least a Match", async function() {
      const result = await w3cApi.getHistoryMatchVersusOpponent1v1(
        `Chef#21383`,
        `keot#2622`
      );

      assert.strictEqual(true, result.count >= 1);
    });
    it("This usecase should should NOT return a Match", async function() {
      const result = await w3cApi.getHistoryMatchVersusOpponent1v1(
        `Chef#21383`,
        `Positrone#2577696969`
      );

      assert.strictEqual(true, result.count === 0);
    });
  });

  describe("Endpoint => getPlayerGameModeStat (returns the stats by game mode for an opponent)", function() {
    it("This usecase should return at least a Stat", async function() {
      const result = await w3cApi.getPlayerGameModeStat(`Chef#21383`);

      assert.strictEqual(true, result.length >= 1);
    });
    it("This usecase should should NOT return a Stat", async function() {
      const result = await w3cApi.getPlayerGameModeStat(`Positrone#2577696969`);

      assert.strictEqual(true, result[0] === undefined);
    });
  });

  describe("Endpoint => getPlayerStatsByRace (returns the stats by Race for an opponent)", function() {
    it("This usecase should return at least a Stat", async function() {
      const result = await w3cApi.getPlayerStatsByRace(`Chef#21383`);

      assert.strictEqual(true, result.length >= 1);
    });
    it("This usecase should should NOT return a Stat", async function() {
      const result = await w3cApi.getPlayerStatsByRace(`Positrone#2577696969`);

      assert.strictEqual(true, result.length === 0);
    });
  });
});
