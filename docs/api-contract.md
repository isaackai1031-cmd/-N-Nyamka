# API гэрээ (L11)

Үндсэн зам: `/api/v1`. JSON ашиглана.

## Алдааны нийтлэг формат
```json
{ "code": "SKU_DUPLICATE", "message": "P01 SKU аль хэдийн бүртгэлтэй", "details": {}, "request_id": "req-123" }
```

| Status | Хэзээ |
|--------|-------|
| 200 | Амжилттай уншсан / өөрчилсөн |
| 201 | Шинээр үүсгэсэн |
| 400 | Body нь JSON биш (`INVALID_JSON`) — L18-д нэмэв |
| 404 | Хүссэн resource байхгүй (`PRODUCT_NOT_FOUND`), эсвэл зам өөрөө байхгүй (`ROUTE_NOT_FOUND`) |
| 409 | Оролт зөв ч одоогийн төлөвтэй зөрчилдөнө (давхар SKU, хүрэлцэхгүй, аль хэдийн posted) |
| 422 | Оролт өөрөө буруу (хоосон нэр, quantity 0, сөрөг, бутархай) |

**Бизнес алдаанд 200 буцаахгүй.** Алдаа бүр 4xx status + дээрх формат.

Хариу бүр `X-Request-Id` header-тэй. Клиент өөрөө илгээсэн бол (`A-Z a-z 0-9 -`, 64 хүртэл тэмдэгт) тэр утга хэвээр буцна (L18).

---

## 0. GET /api/v1/health (L18)
- **200**: `{ "status": "ok", "uptime_s": 12 }`

## 1. GET /api/v1/products
Барааны жагсаалт.
- **Query (L18, хоёулаа заавал биш):** `q` нь SKU эсвэл нэрээр хайна (том жижиг үсэг ялгахгүй); `active` нь `true` эсвэл `false`. Өөр утга бол **422**.
- **200**
```json
[{ "id": 1, "sku": "P01", "name": "Дэвтэр", "unit": "ширхэг", "is_active": true }]
```
- Бараа байхгүй бол **200** ба `[]`. Энэ нь 404 биш, учир нь жагсаалт өөрөө байгаа ч хоосон.

## 2. GET /api/v1/products/{id}
- **200**: нэг бараа (дээрхтэй ижил талбартай)
- **404**: `{ "code": "PRODUCT_NOT_FOUND", "message": "999 id-тай бараа олдсонгүй", ... }` (AC-02.2, P04)
- **422**: id нь эерэг бүхэл тоо биш (`abc`, `0`, `1.5`) (L18)

## 3. POST /api/v1/products
- **Оролт**
```json
{ "sku": "P06", "name": "Харандаа", "unit": "ширхэг" }
```
- **201**: `{ "id": 6, "sku": "P06", "name": "Харандаа", "unit": "ширхэг", "is_active": true }` (P01)
- **409**: `{ "code": "SKU_DUPLICATE", ... }` (AC-01.2, P02)
- **422**: `{ "code": "VALIDATION_ERROR", "details": { "name": "хоосон байж болохгүй" } }` (AC-01.3, P03)

Input schema-д `id` байхгүй, response schema-д байна. Хоёр нь өөр байж болно.

**Талбарын дүрэм (L15 design review-ээр тодруулсан):**
| Талбар | Заавал | Дүрэм |
|--------|--------|-------|
| sku | Тийм | Том үсэг рүү хөрвүүлнэ (`p06` → `P06`); `^[A-Z0-9-]{2,30}$`; давхардвал 409 |
| name | Тийм | Хоосон зай хасаад 1–150 тэмдэгт; хоосон бол 422 |
| unit | Үгүй | Өгөөгүй бол `"ширхэг"`; 1–10 тэмдэгт |

## 4. POST /api/v1/documents
Draft баримт үүсгэнэ.
- **Оролт**
```json
{
  "type": "receipt",
  "warehouse_id": 1,
  "supplier_id": 1,
  "lines": [{ "product_id": 1, "quantity": 5 }]
}
```
- **201**: `{ "id": 2, "doc_no": "R-0002", "type": "receipt", "status": "draft", "lines": [...] }` (P06: үлдэгдэл хэвээр)
- **422**: quantity 0, сөрөг, бутархай (T02); ижил product_id хоёр мөр; type буруу
- **404**: warehouse_id эсвэл product_id байхгүй

## 5. POST /api/v1/documents/{id}/post
Баримтыг батална.
- **200**: `{ "id": 2, "status": "posted", "posted_at": "2026-10-28T09:00:00Z" }` (P07)
- **404**: `{ "code": "DOCUMENT_NOT_FOUND", ... }`
- **409**: `{ "code": "ALREADY_POSTED", ... }` (P11, T05)
- **409**: `{ "code": "INSUFFICIENT_STOCK", "details": { "product_id": 1, "available": 10, "requested": 11 } }` (P10)

Аль ч 409-ийн үед status, movement, balance өөрчлөгдөхгүй.

---

## Цаашид нэмэгдэх (G4)
`POST /documents/{id}/reverse`, `GET /stock`, `GET /movements`
