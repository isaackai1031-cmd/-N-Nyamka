// L18: Express app-ийг УГСАРНА. Сервер асаахгүй (listen нь index.js-д).
// Ингэж салгасны ашиг: тест нь app-ийг өөрийн түр port дээр асааж шалгана.
//
// MIDDLEWARE-ИЙН ДАРААЛАЛ ЧУХАЛ. Хүсэлт дээрээс доош нэг нэгээр дамжина:
//   1. requestId      → хүсэлтэд дугаар өгнө (доорх бүгд req.id-г хэрэглэнэ)
//   2. express.json   → JSON body-г уншиж req.body болгоно (route-ийн ӨМНӨ байх ёстой)
//   3. route-ууд      → таарсан нь хариу буцаана
//   4. routeNotFound  → аль нь ч таараагүй бол 404
//   5. errorHandler   → дээрх аль нэгээс шидэгдсэн алдааг JSON болгоно (ХАМГИЙН СҮҮЛД)
const express = require("express");
const { requestId } = require("./middleware/request-id");
const { routeNotFound, errorHandler } = require("./middleware/error-handler");
const { createHealthRouter } = require("./routes/health");
const { createProductsRouter } = require("./routes/products");
const { createProductService } = require("./services/product-service");
const { createProductRepository } = require("./repositories/product-memory");

// productRepo-г гаднаас өгч болно (тест, L19-ийн MySQL). Өгөөгүй бол түр санах ойнх.
function createApp({ productRepo = createProductRepository() } = {}) {
  const app = express();
  const productService = createProductService(productRepo);

  app.use(requestId);
  app.use(express.json());

  app.use("/api/v1/health", createHealthRouter());
  app.use("/api/v1/products", createProductsRouter(productService));

  app.use(routeNotFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
