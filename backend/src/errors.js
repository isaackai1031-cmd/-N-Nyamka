// L18: Алдааны НЭГ хэлбэр (api-contract.md "Алдааны нийтлэг формат").
// Service эсвэл route нь `throw new AppError(...)` гэж шиднэ.
// Хариуг JSON болгож буцаах ажлыг ганцхан газар (middleware/error-handler.js) хийнэ.

class AppError extends Error {
  // status:  HTTP status (404, 409, 422 ...)
  // code:    программ унших тогтмол нэр ("PRODUCT_NOT_FOUND")
  // message: хүн унших тайлбар
  // details: нэмэлт мэдээлэл (аль талбар буруу гэх мэт)
  constructor(status, code, message, details = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Байнга хэрэглэгдэх алдаануудыг богино функц болгов. Ингэснээр status ба code хэзээ ч зөрөхгүй.
const notFound = (code, message) => new AppError(404, code, message);
const conflict = (code, message, details) => new AppError(409, code, message, details);
const validation = (details) => new AppError(422, "VALIDATION_ERROR", "Оролт буруу байна", details);

module.exports = { AppError, notFound, conflict, validation };
