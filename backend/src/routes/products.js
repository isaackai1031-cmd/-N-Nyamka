// L18: Барааны ROUTE. Зөвхөн HTTP-ийн ажил: оролтыг унших, service дуудах, status + JSON буцаах.
// Дүрэм шийдэхгүй (service), өгөгдөл хадгалахгүй (repository).
//
// Оролт ГУРВАН газраас ирдэг. Гурвуулаа ТЕКСТ байдаг тул шалгаж хөрвүүлнэ:
//   req.params  → замын хэсэг      /products/:id        "аль нэгийг нь"
//   req.query   → ?-ийн дараах     /products?q=дэв      "яаж шүүх вэ"
//   req.body    → JSON body        POST-ийн өгөгдөл     "юу үүсгэх вэ"
const express = require("express");
const { validation } = require("../errors");

// "7" → 7. "abc", "1.5", "0", "-1", "7x" → 422.
function parseId(raw) {
  if (!/^[1-9][0-9]*$/.test(raw)) {
    throw validation({ id: "эерэг бүхэл тоо байх ёстой" });
  }
  return Number(raw);
}

// ?q=дэв&active=true → { q: "дэв", isActive: true }
function parseListQuery(query) {
  const filter = {};

  if (query.q !== undefined) {
    if (typeof query.q !== "string") throw validation({ q: "нэг л утга өгнө" }); // ?q=a&q=b → массив
    const q = query.q.trim();
    if (q !== "") filter.q = q;
  }

  if (query.active !== undefined) {
    if (query.active === "true") filter.isActive = true;
    else if (query.active === "false") filter.isActive = false;
    else throw validation({ active: "true эсвэл false" });
  }

  return filter;
}

function createProductsRouter(service) {
  const router = express.Router();

  // GET /api/v1/products?q=...&active=true|false
  router.get("/", async (req, res) => {
    const products = await service.list(parseListQuery(req.query));
    res.json(products); // олдоогүй бол [] ба 200 (404 биш)
  });

  // GET /api/v1/products/:id
  router.get("/:id", async (req, res) => {
    const product = await service.getById(parseId(req.params.id));
    res.json(product);
  });

  // POST /api/v1/products   body: { sku, name, unit? }
  router.post("/", async (req, res) => {
    // Content-Type: application/json байхгүй бол express.json() body-г уншихгүй → req.body нь undefined.
    const created = await service.create(req.body);
    res.status(201).json(created);
  });

  // Анхаар: энд try/catch байхгүй. Express 5 нь async handler-ээс шидэгдсэн алдааг
  // өөрөө барьж error handler middleware руу дамжуулдаг. (Express 4-д next(err) гэж гараар дуудах ёстой байсан.)
  return router;
}

module.exports = { createProductsRouter, parseId, parseListQuery };
