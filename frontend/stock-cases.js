// Ажиллуулах: node frontend/stock-cases.js
const { products, searchByName, sortByQty, calcBalance } = require("./stock.js");
const before = JSON.stringify(products);

console.log("1. Хайлт 'дэв':", searchByName(products, "дэв").map((p) => p.sku));
console.log("2. Хайлт 'P04':", searchByName(products, "P04").map((p) => p.sku));
console.log("3. Хайлт олдохгүй 'zzz':", searchByName(products, "zzz"));
console.log("4. Хайлт хоосон:", searchByName(products, "").length, "бараа");
console.log("5. Эрэмбэ asc:", sortByQty(products).map((p) => `${p.sku}:${p.qty}`).join(" "));
console.log("6. Эрэмбэ desc:", sortByQty(products, "desc").map((p) => `${p.sku}:${p.qty}`).join(" "));
console.log("7. Эрэмбэ дахин asc:", sortByQty(products).map((p) => `${p.sku}:${p.qty}`).join(" "));
console.log("8. Эх массив хэвээр үү:", JSON.stringify(products) === before);

const ok = [
  { type: "opening", qty: 10 },
  { type: "receipt", qty: 5 },
  { type: "issue", qty: 4 },
];
console.log("9. 10 + 5 - 4:", calcBalance(ok));
console.log("10. Ижил оролт дахин:", calcBalance(ok), "| оролт хэвээр:", ok.length === 3);
console.log("11. Хоосон []:", calcBalance([]));
console.log("12. qty 0:", calcBalance([{ type: "opening", qty: 0 }]));
console.log("13. qty -1:", calcBalance([{ type: "opening", qty: -1 }]));
console.log("14. qty '5' (текст):", calcBalance([{ type: "opening", qty: "5" }]));
console.log("15. qty 'abc':", calcBalance([{ type: "opening", qty: "abc" }]));
console.log("16. qty 2.5:", calcBalance([{ type: "opening", qty: 2.5 }]));
console.log("17. 10-аас 11 зарлага:", calcBalance([{ type: "opening", qty: 10 }, { type: "issue", qty: 11 }]));
console.log("18. 10-аас 10 зарлага:", calcBalance([{ type: "opening", qty: 10 }, { type: "issue", qty: 10 }]));
console.log("19. type буруу:", calcBalance([{ type: "gift", qty: 1 }]));
console.log("20. Coercion: '10' + '5' =", "10" + "5", "| Number('10') + Number('5') =", Number("10") + Number("5"));
