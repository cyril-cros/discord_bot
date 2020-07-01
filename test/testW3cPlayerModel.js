const W3cPlayer = require("../model/W3cPlayer").W3cPlayer;

let assert = require("assert");

describe("W3C Player Model init", function() {
  describe("Create a Player Model with all it stats)", function() {
      it("This usecase should return a PLayer", async function() {
        const player = new W3cPlayer("Chef#21383");
        await player.initPlayer();

        assert.strictEqual(true, player.battleTag === "Chef#21383");
      });
    it("This usecase should return a PLayer", async function() {
      const player = new W3cPlayer("keot#2622");
      await player.initPlayer();

      assert.strictEqual(true, player.battleTag === "keot#2622");
    });
  });
});
