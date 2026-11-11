// L18: Барааны ТҮР САНАХ ОЙН repository. Сервер унтрахад өгөгдөл алга болно.
// L19-д үүнийг MySQL repository-оор солино. Функцийн нэр, буцаах хэлбэр нь хэвээр үлдэх тул
// service болон route-ийг өөрчлөх шаардлагагүй болно.
//
// Функц бүр `async`: одоо шууд хариулж байгаа ч DB-тэй болоход хүлээх хэрэгтэй болно.
// Одооноос `await`-тай бичвэл L19-д дуудагч тал өөрчлөгдөхгүй.

// Seed: data-dictionary.md-ийн fixture (frontend/data/products.json-той ижил).
const SEED = [
  { id: 1, sku: "P01", name: "Дэвтэр", unit: "ширхэг", is_active: true },
  { id: 2, sku: "P02", name: "Үзэг", unit: "ширхэг", is_active: true },
  { id: 3, sku: "P03", name: "Хавтас", unit: "ширхэг", is_active: true },
  { id: 4, sku: "P04", name: "Маркер", unit: "ширхэг", is_active: true },
  { id: 5, sku: "P05", name: "Цаас", unit: "боодол", is_active: true },
];

function createProductRepository(seed = SEED) {
  // Хуулбар авна: тест бүр өөрийн цэвэр жагсаалттай эхэлнэ, SEED өөрчлөгдөхгүй.
  let rows = seed.map((p) => ({ ...p }));
  let nextId = rows.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  return {
    // filter: { q?: string, isActive?: boolean }
    async findAll({ q, isActive } = {}) {
      let result = rows;
      if (isActive !== undefined) {
        result = result.filter((p) => p.is_active === isActive);
      }
      if (q) {
        const needle = q.toLowerCase();
        result = result.filter(
          (p) => p.sku.toLowerCase().includes(needle) || p.name.toLowerCase().includes(needle),
        );
      }
      return result.map((p) => ({ ...p })); // дотоод объектыг гадагш шууд өгөхгүй
    },

    async findById(id) {
      const found = rows.find((p) => p.id === id);
      return found ? { ...found } : null;
    },

    async findBySku(sku) {
      const found = rows.find((p) => p.sku === sku);
      return found ? { ...found } : null;
    },

    async insert({ sku, name, unit }) {
      const row = { id: nextId++, sku, name, unit, is_active: true };
      rows.push(row);
      return { ...row };
    },
  };
}

module.exports = { createProductRepository };
