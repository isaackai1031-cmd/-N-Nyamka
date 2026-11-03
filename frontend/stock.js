// L12: Агуулахын өгөгдөл боловсруулах (DOM-гүй, цэвэр функцууд)

const products = [
  { sku: "P01", name: "Дэвтэр", qty: 10 },
  { sku: "P02", name: "Үзэг", qty: 25 },
  { sku: "P03", name: "Хавтас", qty: 0 },
  { sku: "P04", name: "Маркер", qty: 7 },
  { sku: "P05", name: "Цаас", qty: 3 },
];

// 1. Хайлт: filter нь шинэ массив буцаана, эх массив өөрчлөгдөхгүй
function searchByName(list, text) {
  const q = String(text ?? "").trim().toLowerCase();
  if (q === "") return [...list];
  return list.filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );
}

// 2. Эрэмбэлэлт: sort() ЭХ массивыг өөрчилдөг тул [...list] хуулбар дээр хийнэ
function sortByQty(list, direction = "asc") {
  const sign = direction === "desc" ? -1 : 1;
  return [...list].sort((a, b) => sign * (a.qty - b.qty));
}

// 3. Хөдөлгөөнөөс үлдэгдэл бодох
//    movements: [{ type: "opening" | "receipt" | "issue", qty: эерэг бүхэл тоо }]
//    Буцаах: { ok: true, value } эсвэл { ok: false, error }
const PLUS = ["opening", "receipt"];
const MINUS = ["issue"];

function calcBalance(movements) {
  if (!Array.isArray(movements)) {
    return { ok: false, error: "movements массив биш байна" };
  }
  let balance = 0;
  for (let i = 0; i < movements.length; i++) {
    const m = movements[i];
    // typeof шалгалт: "5" гэх мэт текстийг хүлээж авахгүй, учир нь "10" + "5" = "105" болно
    if (typeof m.qty !== "number" || !Number.isInteger(m.qty) || m.qty <= 0) {
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

// Node-д ажиллуулах үед export хийнэ, браузерт энэ мөр алгасагдана
if (typeof module !== "undefined") {
  module.exports = { products, searchByName, sortByQty, calcBalance };
}
