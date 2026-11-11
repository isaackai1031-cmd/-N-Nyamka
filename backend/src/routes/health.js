// L18: Сервер амьд эсэхийг шалгах хамгийн энгийн endpoint.
// DB, бизнес дүрэм хамаарахгүй: "процесс хүсэлт хүлээж авч байна уу" гэдгийг л хэлнэ.
const express = require("express");

function createHealthRouter() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({ status: "ok", uptime_s: Math.round(process.uptime()) });
  });

  return router;
}

module.exports = { createHealthRouter };
