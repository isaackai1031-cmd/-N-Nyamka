const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadConfig } = require("../src/config");

test("PORT өгөөгүй → 3000, NODE_ENV → development", () => {
  assert.deepEqual(loadConfig({}), { port: 3000, nodeEnv: "development" });
});

test("PORT текст '8080' → тоо 8080", () => {
  assert.equal(loadConfig({ PORT: "8080" }).port, 8080);
});

test("PORT 'abc', '0', '70000', '80.5' → алдаа", () => {
  for (const PORT of ["abc", "0", "70000", "80.5"]) {
    assert.throws(() => loadConfig({ PORT }), /PORT буруу/, PORT);
  }
});
