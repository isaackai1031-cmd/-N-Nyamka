// L18: HTTP түвшний шалгалт. Жинхэнэ серверийг түр port дээр асааж, fetch-ээр хүсэлт илгээнэ.
// Нэмэлт сан (supertest гэх мэт) хэрэггүй: Node 20+ нь fetch-тэй.
// Бүрэн тестийн төлөвлөгөө L21-д. Энд L18-ийн "хүлээн авах шалгуур"-ыг л батална.
const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../src/app");

let server;
let base;

before(async () => {
  // listen(0): үйлдлийн систем сул port-ыг өөрөө сонгоно → 3000 завгүй байсан ч тест ажиллана.
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://localhost:${server.address().port}/api/v1`;
});

after(() => server.close()); // хаахгүй бол `npm test` дуусахгүй өлгөгдөнө

const postJson = (path, data) =>
  fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// Алдааны хариу бүр ижил 4 талбартай эсэх.
function assertErrorShape(body, code) {
  assert.deepEqual(Object.keys(body).sort(), ["code", "details", "message", "request_id"]);
  assert.equal(body.code, code);
  assert.match(body.request_id, /^req-/);
}

describe("L18 хүлээн авах шалгуур: 3 request", () => {
  test("1. GET хэвийн: /products/1 → 200, P01", async () => {
    const res = await fetch(`${base}/products/1`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      id: 1, sku: "P01", name: "Дэвтэр", unit: "ширхэг", is_active: true,
    });
  });

  test("2. буруу id: /products/abc → 422 VALIDATION_ERROR", async () => {
    const res = await fetch(`${base}/products/abc`);
    assert.equal(res.status, 422);
    const body = await res.json();
    assertErrorShape(body, "VALIDATION_ERROR");
    assert.ok(body.details.id);
  });

  test("3. олдоогүй id: /products/999 → 404 PRODUCT_NOT_FOUND (P04)", async () => {
    const res = await fetch(`${base}/products/999`);
    assert.equal(res.status, 404);
    assertErrorShape(await res.json(), "PRODUCT_NOT_FOUND");
  });
});

describe("health ба request ID", () => {
  test("GET /health → 200 { status: ok }", async () => {
    const res = await fetch(`${base}/health`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, "ok");
  });

  test("request ID өгөөгүй бол сервер үүсгэж header-т буцаана", async () => {
    const res = await fetch(`${base}/health`);
    assert.match(res.headers.get("x-request-id"), /^req-/);
  });

  test("клиентийн өгсөн X-Request-Id хариу болон алдааны body-д хэвээр", async () => {
    const res = await fetch(`${base}/products/999`, { headers: { "X-Request-Id": "demo-42" } });
    assert.equal(res.headers.get("x-request-id"), "demo-42");
    assert.equal((await res.json()).request_id, "demo-42");
  });

  test("байхгүй зам → 404 ROUTE_NOT_FOUND (HTML биш, JSON)", async () => {
    const res = await fetch(`${base}/nope`);
    assert.equal(res.status, 404);
    assertErrorShape(await res.json(), "ROUTE_NOT_FOUND");
  });
});

describe("query filter", () => {
  test("GET /products → 5 бараа", async () => {
    const res = await fetch(`${base}/products`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).length, 5);
  });

  test("?q=дэв → Дэвтэр (том жижиг үсэг ялгахгүй)", async () => {
    const res = await fetch(`${base}/products?q=${encodeURIComponent("дэв")}`);
    assert.deepEqual((await res.json()).map((p) => p.sku), ["P01"]);
  });

  test("?q=байхгүй → 200 ба [] (404 биш)", async () => {
    const res = await fetch(`${base}/products?q=zzz`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  });

  test("?active=yes → 422", async () => {
    const res = await fetch(`${base}/products?active=yes`);
    assert.equal(res.status, 422);
    assertErrorShape(await res.json(), "VALIDATION_ERROR");
  });
});

describe("JSON body (POST /products)", () => {
  test("зөв оролт → 201, id 6, SKU том үсгээр (P01)", async () => {
    const res = await postJson("/products", { sku: "p06", name: "Харандаа" });
    assert.equal(res.status, 201);
    assert.deepEqual(await res.json(), {
      id: 6, sku: "P06", name: "Харандаа", unit: "ширхэг", is_active: true,
    });
  });

  test("давхар SKU → 409 SKU_DUPLICATE (P02)", async () => {
    const res = await postJson("/products", { sku: "P01", name: "Өөр нэр" });
    assert.equal(res.status, 409);
    assertErrorShape(await res.json(), "SKU_DUPLICATE");
  });

  test("хоосон нэр → 422, details.name (P03)", async () => {
    const res = await postJson("/products", { sku: "P07", name: "   " });
    assert.equal(res.status, 422);
    const body = await res.json();
    assertErrorShape(body, "VALIDATION_ERROR");
    assert.ok(body.details.name);
  });

  test("эвдэрхий JSON → 400 INVALID_JSON", async () => {
    const res = await fetch(`${base}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ sku: ",
    });
    assert.equal(res.status, 400);
    assertErrorShape(await res.json(), "INVALID_JSON");
  });

  test("Content-Type байхгүй → body уншигдахгүй → 422 (500 биш)", async () => {
    const res = await fetch(`${base}/products`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sku: "P08", name: "Цавуу" }),
    });
    assert.equal(res.status, 422);
  });
});
