// L18: Барааны SERVICE. Бизнес дүрэм энд байна (architecture.md).
// req/res гэж мэдэхгүй, SQL бичихгүй. Зөвхөн "зөвшөөрөх үү, үгүй юу" гэдгийг шийднэ.
const { normalizeProduct } = require("../domain/stock");
const { notFound, conflict, validation } = require("../errors");

// repo-г гаднаас авна (dependency injection). L19-д MySQL repository өгөхөд энэ файл өөрчлөгдөхгүй.
function createProductService(repo) {
  return {
    async list(filter) {
      return repo.findAll(filter);
    },

    async getById(id) {
      const product = await repo.findById(id);
      if (!product) {
        throw notFound("PRODUCT_NOT_FOUND", `${id} id-тай бараа олдсонгүй`); // AC-02.2, P04
      }
      return product;
    },

    async create(input) {
      // 1. Оролт өөрөө буруу юу? → 422 (P03)
      const checked = normalizeProduct(input);
      if (!checked.ok) throw validation(checked.errors);

      // 2. Оролт зөв ч одоогийн төлөвтэй зөрчилдөж байна уу? → 409 (P02)
      const existing = await repo.findBySku(checked.value.sku);
      if (existing) {
        throw conflict("SKU_DUPLICATE", `${checked.value.sku} SKU аль хэдийн бүртгэлтэй`, {
          sku: checked.value.sku,
        });
      }

      // 3. Хадгална → route 201 буцаана (P01)
      return repo.insert(checked.value);
    },
  };
}

module.exports = { createProductService };
