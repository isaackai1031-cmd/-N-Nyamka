// L18: Хүсэлт бүрд давтагдашгүй дугаар (request ID) өгнө.
// Зорилго: хэрэглэгч "алдаа гарлаа, request_id нь req-..." гэж хэлэхэд log-оос яг тэр хүсэлтийг олно.
const { randomUUID } = require("node:crypto");

// Гаднаас ирсэн дугаарыг зөвхөн энэ хэлбэртэй бол итгэнэ (log руу хог бичүүлэхгүй).
const SAFE_ID = /^[A-Za-z0-9-]{1,64}$/;

function requestId(req, res, next) {
  const incoming = req.get("X-Request-Id");
  const id = incoming && SAFE_ID.test(incoming) ? incoming : `req-${randomUUID()}`;

  req.id = id; // дараагийн middleware, route, error handler эндээс уншина
  res.set("X-Request-Id", id); // хариуны header-т мөн буцаана

  next(); // ЗААВАЛ дуудна. Мартвал хүсэлт энд гацаж, браузер хариу хүлээсээр байна.
}

module.exports = { requestId };
