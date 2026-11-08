// L17: Агуулахын цэвэр дүрмүүд (HTTP, DB мэдэхгүй).
// L12-ын frontend/stock.js-ийн calcBalance-ийг сервер талд module болгон авчирлаа.
// Браузер require() мэддэггүй тул frontend өөрийн хуулбартай хэвээр үлдэнэ (L51-д нэгтгэнэ).

const PLUS = ["opening", "receipt"];
const MINUS = ["issue"];

// Эерэг бүхэл тоо эсэх. typeof шалгалт: "5" гэх мэт текстийг хүлээн авахгүй.
function isPositiveInt(n) {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}

// movements: [{ type: "opening" | "receipt" | "issue", qty }]
// Буцаах: { ok: true, value } эсвэл { ok: false, error }
function calcBalance(movements) {
  if (!Array.isArray(movements)) {
    return { ok: false, error: "movements массив биш байна" };
  }
  let balance = 0;
  for (let i = 0; i < movements.length; i++) {
    const m = movements[i];
    if (!isPositiveInt(m.qty)) {
      return { ok: false, error: `${i}-р мөр: qty эерэг бүхэл тоо байх ёстой (${JSON.stringify(m.qty)})` };
    }
    if (PLUS.includes(m.type)) {
      balance += m.qty;
    } else if (MINUS.includes(m.type)) {
      if (m.qty > balance) {
        return { ok: false, error: `${i}-р мөр: үлдэгдэл ${balance} байхад ${m.qty} зарлагадах боломжгүй` };
      }
      balance -= m.qty;
    } else {
      return { ok: false, error: `${i}-р мөр: type "${m.type}" буруу` };
    }
  }
  return { ok: true, value: balance };
}

// api-contract §3-ын талбарын дүрэм. L20-ийн POST /products-д 422 гаргахад ашиглана.
// Давхар SKU (409)-г энд шалгахгүй: энэ нь DB-ийн төлөвөөс хамаардаг тул service/repository-ийн ажил.
const SKU_RE = /^[A-Z0-9-]{2,30}$/;

function normalizeProduct(input) {
  const src = input ?? {};
  const errors = {};

  const sku = typeof src.sku === "string" ? src.sku.trim().toUpperCase() : "";
  if (sku === "") errors.sku = "заавал";
  else if (!SKU_RE.test(sku)) errors.sku = "2–30 тэмдэгт: A-Z, 0-9, зураас";

  const name = typeof src.name === "string" ? src.name.trim() : "";
  if (name === "") errors.name = "хоосон байж болохгүй";
  else if (name.length > 150) errors.name = "150 тэмдэгтээс ихгүй";

  let unit = "ширхэг";
  if (src.unit !== undefined) {
    unit = typeof src.unit === "string" ? src.unit.trim() : "";
    if (unit.length < 1 || unit.length > 10) errors.unit = "1–10 тэмдэгт";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { sku, name, unit } };
}

module.exports = { calcBalance, normalizeProduct, isPositiveInt };
