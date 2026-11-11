// L18: Алдааг ганцхан газар JSON болгоно. Route бүр өөрийн алдааны хэлбэр зохиохгүй.
const { AppError } = require("../errors");

// Ямар ч route таараагүй үед энд ирнэ (app.js-д бүх route-ийн ДАРАА бүртгэсэн).
function routeNotFound(req, res, next) {
  next(new AppError(404, "ROUTE_NOT_FOUND", `${req.method} ${req.path} гэсэн зам байхгүй`));
}

// Express нь 4 параметртэй функцийг "алдааны middleware" гэж таньдаг.
// Тиймээс `next`-ийг хэрэглээгүй ч параметрийн жагсаалтаас хасаж болохгүй.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // 1. Бидний өөрсдийн шидсэн алдаа: status, code нь бэлэн.
  if (err instanceof AppError) {
    return res.status(err.status).json(body(req, err.code, err.message, err.details));
  }

  // 2. express.json() body-г уншиж чадаагүй (эвдэрхий JSON). Энэ нь клиентийн алдаа тул 400.
  if (err.type === "entity.parse.failed") {
    return res.status(400).json(body(req, "INVALID_JSON", "Body нь зөв JSON биш байна"));
  }

  // 3. Бидний урьдчилан тооцоогүй алдаа (кодын bug). Дэлгэрэнгүйг СЕРВЕРИЙН log-д бичнэ,
  //    клиент рүү дотоод мэдээлэл (stack, SQL) гаргахгүй.
  console.error(`[${req.id}]`, err);
  return res.status(500).json(body(req, "INTERNAL_ERROR", "Серверийн дотоод алдаа"));
}

function body(req, code, message, details = {}) {
  return { code, message, details, request_id: req.id };
}

module.exports = { routeNotFound, errorHandler };
