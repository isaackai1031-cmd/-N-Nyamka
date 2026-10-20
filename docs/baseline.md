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

SQL JOIN-ийн нарийн механизм — INNER JOIN, LEFT JOIN, RIGHT JOIN-ийн ялгааг бүрэн ойлгоогүй. Ялангуяа олон хүснэгт холбох үед ямар мөрүүд үлдэхийг тодорхойлоход хүндрэлтэй байна.

Transaction rollback ба commit — Transaction хэзээ автоматаар commit болж, хэзээ rollback хийх ёстойг бүрэн ойлгоогүй. Ялангуяа олон мөр оруулах үед нэг нь алдаатай болвол бусдыг хэрхэн буцаахыг мэдэхгүй байна.

HTTP status code-ийн ялгаа — 400, 401, 403, 404, 422 статусуудын ялгааг бүрэн ойлгоогүй. Ялангуяа  422 Unprocessable Entity-ийн хил заагийг тодорхойлоход хүндрэлтэй.

FastAPI-ийн dependency injection — Depends()-ийг хэрхэн зөв ашиглах, яагаад хэрэгтэйг бүрэн ойлгоогүй. Ялангуяа database session-ийг dependency болгон дамжуулах механизм.

## Хувийн 
4 долоо хоногийн дотор Git-ийг бүрэн эзэмших — Issue үүсгэх, feature салбар ашиглах, PR үүсгэх, peer review авах, merge conflict шийдэх бүх урсгалыг бие даан хийж чаддаг болох. Үүнийг L02, L07, L08 лабораториудад commit, PR, review хийх замаар баталгаажуулна.

SQL-ийн JOIN болон transaction-ийг ойлгож, ашиглаж чаддаг болох — INNER JOIN, LEFT JOIN-ийг ашиглан олон хүснэгтийн өгөгдлийг нэгтгэх, transaction дотор олон мөр оруулаад алдаа гарвал бүгдийг rollback хийх чадварыг эзэмших. Үүнийг L01-ийн SQL дасгал болон дараагийн шатны батлалтын тестүүдээр баталгаажуулна.


