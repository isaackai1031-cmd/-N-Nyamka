// L17: Node.js entry point. Express-ийг L18-д нэмнэ. Одоогоор runtime ба module-ийг шалгана.
const path = require("node:path"); // Node-ийн суурь module (node: угтвар)
const { loadConfig } = require("./config"); // Өөрийн module (./ харьцангуй зам)
const { calcBalance, normalizeProduct } = require("./domain/stock");

function main() {
  let config;
  try {
    config = loadConfig();
  } catch (err) {
    console.error("[config error]", err.message);
    process.exitCode = 1; // process.exit()-ээс зөөлөн: үлдсэн ажлыг дуусгаад гарна
    return;
  }

  console.log("Node:", process.version, "|", process.platform);
  console.log("Энэ файл:", path.relative(process.cwd(), __filename));
  console.log("Тохиргоо:", config);

  // T03 урсгал: opening 10, receipt +5, issue -4 → 11
  console.log("T03:", calcBalance([
    { type: "opening", qty: 10 },
    { type: "receipt", qty: 5 },
    { type: "issue", qty: 4 },
  ]));
  console.log("P01 оролт:", normalizeProduct({ sku: " p06 ", name: "Харандаа" }));
  console.log("P03 оролт:", normalizeProduct({ sku: "P07", name: "   " }));
}

// Шууд ажиллуулсан үед л main() дуудна. require() хийсэн тестэд ажиллахгүй.
if (require.main === module) {
  main();
}

module.exports = { main };
