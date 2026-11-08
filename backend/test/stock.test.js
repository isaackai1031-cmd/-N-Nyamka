// L17: node:test + assert. L12-ын console кейсүүдийг автомат шалгалт болгов.
// Ажиллуулах: cd backend && npm test
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { calcBalance, normalizeProduct } = require("../src/domain/stock");

describe("calcBalance (js-cases 9–19)", () => {
  test("9. opening 10, receipt 5, issue 4 → 11 (T03)", () => {
    assert.deepEqual(calcBalance([
      { type: "opening", qty: 10 },
      { type: "receipt", qty: 5 },
      { type: "issue", qty: 4 },
    ]), { ok: true, value: 11 });
  });

  test("10. ижил оролт дахин → ижил үр дүн, оролт өөрчлөгдөхгүй", () => {
    const input = [{ type: "opening", qty: 10 }, { type: "issue", qty: 4 }];
    const before = JSON.stringify(input);
    assert.deepEqual(calcBalance(input), calcBalance(input));
    assert.equal(JSON.stringify(input), before);
  });

  test("11. хоосон [] → 0 (AC-08.2)", () => {
    assert.deepEqual(calcBalance([]), { ok: true, value: 0 });
  });

  for (const qty of [0, -1, "5", "abc", 2.5]) {
    test(`12–16. qty ${JSON.stringify(qty)} → алдаа (T02)`, () => {
      const r = calcBalance([{ type: "opening", qty }]);
      assert.equal(r.ok, false);
      assert.match(r.error, /эерэг бүхэл/);
    });
  }

  test("17. 10-аас 11 зарлага → алдаа (P10)", () => {
    const r = calcBalance([{ type: "opening", qty: 10 }, { type: "issue", qty: 11 }]);
    assert.equal(r.ok, false);
    assert.match(r.error, /үлдэгдэл 10/);
  });

  test("18. 10-аас 10 зарлага → 0, хил зааг (P09)", () => {
    assert.deepEqual(
      calcBalance([{ type: "opening", qty: 10 }, { type: "issue", qty: 10 }]),
      { ok: true, value: 0 }
    );
  });

  test("19. type буруу → алдаа", () => {
    assert.equal(calcBalance([{ type: "gift", qty: 1 }]).ok, false);
  });

  test("массив биш → алдаа", () => {
    assert.equal(calcBalance(null).ok, false);
  });
});

describe("normalizeProduct (api-contract §3)", () => {
  test("p06 → P06, unit анхдагч ширхэг (P01)", () => {
    assert.deepEqual(normalizeProduct({ sku: " p06 ", name: " Харандаа " }), {
      ok: true,
      value: { sku: "P06", name: "Харандаа", unit: "ширхэг" },
    });
  });

  test("хоосон нэр → name алдаа (P03, AC-01.3)", () => {
    const r = normalizeProduct({ sku: "P07", name: "   " });
    assert.equal(r.ok, false);
    assert.ok(r.errors.name);
  });

  test("SKU буруу тэмдэгт, хэт богино, хэт урт", () => {
    for (const sku of ["P 01", "P", "A".repeat(31), "Р01" /* кирилл Р */]) {
      assert.ok(normalizeProduct({ sku, name: "x" }).errors?.sku, sku);
    }
  });

  test("SKU 30 тэмдэгт, нэр 150 тэмдэгт → зөвшөөрнө (хил зааг)", () => {
    assert.equal(normalizeProduct({ sku: "A".repeat(30), name: "н".repeat(150) }).ok, true);
  });

  test("нэр 151 тэмдэгт → алдаа", () => {
    assert.ok(normalizeProduct({ sku: "P08", name: "н".repeat(151) }).errors?.name);
  });

  test("unit хоосон эсвэл 11 тэмдэгт → алдаа", () => {
    assert.ok(normalizeProduct({ sku: "P09", name: "x", unit: "" }).errors?.unit);
    assert.ok(normalizeProduct({ sku: "P09", name: "x", unit: "12345678901" }).errors?.unit);
  });

  test("тоо, null, оролтгүй → унахгүй, алдаа буцаана", () => {
    assert.equal(normalizeProduct({ sku: 123, name: 456 }).ok, false);
    assert.equal(normalizeProduct(null).ok, false);
    assert.equal(normalizeProduct().ok, false);
  });

  test("олон алдааг нэг дор буцаана", () => {
    const r = normalizeProduct({ sku: "", name: "" });
    assert.deepEqual(Object.keys(r.errors).sort(), ["name", "sku"]);
  });
});
