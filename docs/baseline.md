# Базис ойлголт — Хүнсний агуулах

## Бизнесийн жишээ
- MILK-01 "Сүү (1л)" — 24
- NUT-01 "Самар (500г)" — 10
- BREAD-01 "Талх (350г)" — 30
- EGG-01 "Өндөг (10 ширхэг)" — 15
- RICE-01 "Будаа (5кг)" — 8

**Хэвийн:** MILK-01 +6 орлого батлав → 24-өөс 30.
**Хил зааг:** RICE-01 −8 зарлага → 0. Хоосон үлдэгдэл зөв төлөв.
**Алдаа:** RICE-01 −11 зарлага хүсэв → 409, үлдэгдэл 8 хэвээр.

## Оролдлого 1: JavaScript — хамгийн бага үлдэгдэл
```js
const products = [
  { sku: "MILK-01", name: "Сүү (1л)", qty: 24 },
  { sku: "NUT-01", name: "Самар (500г)", qty: 10 },
  { sku: "BREAD-01", name: "Талх (350г)", qty: 30 },
  { sku: "EGG-01", name: "Өндөг (10 ширхэг)", qty: 15 },
  { sku: "RICE-01", name: "Будаа (5кг)", qty: 8 },
];
let minProduct = null;
for (const p of products) {
  if (minProduct === null || p.qty < minProduct.qty) minProduct = p;
}
console.log(`${minProduct.sku} (${minProduct.qty} ширхэг)`);
```
Үр дүн: `RICE-01 (8 ширхэг)`

## Оролдлого 2: Python — ижил алгоритм
```python
products = [
    {"sku": "MILK-01", "qty": 24},
    {"sku": "NUT-01", "qty": 10},
    {"sku": "BREAD-01", "qty": 30},
    {"sku": "EGG-01", "qty": 15},
    {"sku": "RICE-01", "qty": 8},
]
min_product = None
for p in products:
    if min_product is None or p["qty"] < min_product["qty"]:
        min_product = p
print(f'{min_product["sku"]} ({min_product["qty"]} ширхэг)')
```
Ялгаа: JS-д `p.qty`, Python-д `p["qty"]`. Python-д `{}` блок биш, догол мөр хэрэглэдэг.

## Оролдлого 3: SQL JOIN таамаглал
products: (1, MILK-01), (2, RICE-01), (3, EGG-01)
stock: (1, 24), (2, 8). EGG-01-д мөр байхгүй.
```sql
SELECT p.sku, s.qty FROM products p
JOIN stock s ON s.product_id = p.id;
```
Таамаглал: MILK-01 24, RICE-01 8. EGG-01 гарахгүй.
`LEFT JOIN` болговол EGG-01 нь `NULL` утгатай гарна.

## Мэдэхгүй / нөхөх зүйлс

- (өөрөө бич)

## Хувийн 2 зорилго
1. (өөрөө бич)
2. (өөрөө бич)
