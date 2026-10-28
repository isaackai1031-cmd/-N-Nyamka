# Өгөгдлийн толь (L09–L10)

Эх сурвалж: 00_Eronhii_Tolovlogoo (2-р бүлэг: дүрэм, 4-р бүлэг: fixture), 02_Zohiomj (L09, L10).

## Хүснэгтүүдийн зориулалт
| Хүснэгт | Зориулалт |
|---------|-----------|
| products | Барааны агуулахаас үл хамаарах шинж (SKU, нэр, нэгж). Агуулах солигдоход өөрчлөгдөхгүй. |
| warehouses | Агуулахын лавлах (A, B). |
| suppliers | Нийлүүлэгчийн лавлах. Нэрийг баримтын мөр бүрт давтахгүй, id-аар холбоно. |
| stock_balances | Бараа аль агуулахад хэдэн ширхэг байгааг хадгална. Нэг бараа олон агуулахад байж болох тул products-д биш тусдаа хадгална. |
| documents | Баримтын толгой: төрөл, төлөв, агуулах, нийлүүлэгч. |
| document_lines | Баримтын мөр: аль бараа хэдэн ширхэг. |
| stock_movements | Батлагдсан баримтын үлдэгдлийн өөрчлөлт. Зөвхөн нэмэгдэнэ, засахгүй. |

---

## products
| Багана | Төрөл | Дүрэм | AC |
|--------|-------|-------|----|
| id | INT | PK, AUTO_INCREMENT | |
| sku | VARCHAR(30) | NOT NULL, UNIQUE | AC-01.2 (давхар SKU → 409) |
| name | VARCHAR(150) | NOT NULL | AC-01.3 (хоосон нэр → 422) |
| unit | VARCHAR(10) | NOT NULL, DEFAULT 'ширхэг' | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |

## warehouses
| Багана | Төрөл | Дүрэм |
|--------|-------|-------|
| id | INT | PK |
| code | VARCHAR(10) | NOT NULL, UNIQUE |
| name | VARCHAR(100) | NOT NULL |

## suppliers
| Багана | Төрөл | Дүрэм |
|--------|-------|-------|
| id | INT | PK |
| code | VARCHAR(20) | NOT NULL, UNIQUE |
| name | VARCHAR(150) | NOT NULL |
| phone | VARCHAR(20) | NULL |

## stock_balances
| Багана | Төрөл | Дүрэм |
|--------|-------|-------|
| id | INT | PK |
| warehouse_id | INT | NOT NULL, FK → warehouses.id |
| product_id | INT | NOT NULL, FK → products.id |
| quantity | INT | NOT NULL, DEFAULT 0, CHECK (quantity >= 0) |
| updated_at | DATETIME | NOT NULL |

**UNIQUE (warehouse_id, product_id)**: нэг агуулахад нэг бараа нэг л мөртэй.

## documents
| Багана | Төрөл | Дүрэм | AC |
|--------|-------|-------|----|
| id | INT | PK | |
| doc_no | VARCHAR(30) | NOT NULL, UNIQUE | |
| type | ENUM('opening','receipt','issue','reversal') | NOT NULL | US-03, 04, 05, 07 |
| status | ENUM('draft','posted','cancelled') | NOT NULL, DEFAULT 'draft' | US-06 |
| warehouse_id | INT | NOT NULL, FK → warehouses.id | |
| supplier_id | INT | NULL, FK → suppliers.id (receipt-д) | |
| reversal_of_id | INT | NULL, FK → documents.id, UNIQUE | AC-07.2 |
| note | VARCHAR(255) | NULL | |
| created_at | DATETIME | NOT NULL | |
| posted_at | DATETIME | NULL | |

## document_lines
| Багана | Төрөл | Дүрэм | AC |
|--------|-------|-------|----|
| id | INT | PK | |
| document_id | INT | NOT NULL, FK → documents.id | |
| product_id | INT | NOT NULL, FK → products.id | |
| quantity | INT | NOT NULL, CHECK (quantity > 0) | AC-03.2, 03.3 |

**UNIQUE (document_id, product_id)**: нэг баримтад ижил бараа хоёр мөрөөр бичигдэхгүй.

## stock_movements
| Багана | Төрөл | Дүрэм |
|--------|-------|-------|
| id | INT | PK |
| document_id | INT | NOT NULL, FK → documents.id |
| document_line_id | INT | NOT NULL, FK → document_lines.id |
| warehouse_id | INT | NOT NULL, FK → warehouses.id |
| product_id | INT | NOT NULL, FK → products.id |
| quantity_change | INT | NOT NULL, CHECK (quantity_change <> 0): орлого +, зарлага − |
| created_at | DATETIME | NOT NULL |

---

## Түлхүүрүүдийн үүрэг (L09, алхам 3)
- **SKU UNIQUE**: ижил кодтой хоёр бараа үүсэхээс сэргийлнэ (AC-01.2).
- **Хос түлхүүр UNIQUE (warehouse_id, product_id)**: A агуулахын P01-д хоёр үлдэгдлийн мөр үүсвэл аль нь үнэн болох нь тодорхойгүй болно. Хос түлхүүр нэг хос = нэг мөр гэдгийг баталгаажуулна.
- **FK**: байхгүй агуулах эсвэл бараа руу заасан үлдэгдэл, мөр үүсэхээс сэргийлнэ. Мөн хөдөлгөөнтэй барааг устгахыг хориглоно.

## Шийдвэрүүд ба шалтгаан
1. **Үлдэгдлийг тусдаа хүснэгтэд хадгална**, учир нь P01 нь A-д 10, B-д 2 байж болно. products-д ганц тоогоор хадгалбал хоёр агуулах ялгарахгүй.
2. **quantity нь INT**: бутархай тоо хүрээнээс гадуур.
3. **CHECK (quantity >= 0)** ба API-ийн шалгалт нь давхар хамгаалалт. API нь ойлгомжтой 409 өгнө. DB нь кодын алдаа, зэрэг хүсэлт, шууд SQL-ээс хамгаална.
4. **Барааг устгахгүй, is_active = false (soft delete)**: устгавал хуучин баримт, хөдөлгөөн бараагүй болж тайлан эвдэрнэ.
5. **stock_balances нь хураангуй**: үнэн эх сурвалж нь stock_movements. balance = posted хөдөлгөөний нийлбэр.
6. **Нийлүүлэгчийн нэрийг мөрөнд давтахгүй**: давтвал нэр солигдоход зарим мөр хуучин нэртэй үлдэнэ (шинэчлэлтийн зөрчил).

## Нормчлолын 3 эрсдэл (L10 бие даалт)
| Эрсдэл | Жишээ (нормчлоогүй үед) | Шийдэл |
|--------|-------------------------|--------|
| Давхардал | Мөр бүрт "Номин ХХК" гэж бичвэл нэр 100 удаа хадгалагдана | supplier_id |
| Шинэчлэлт | Нийлүүлэгч нэрээ солиход зарим мөр хуучин нэртэй үлдэнэ | Нэр нэг газар хадгалагдана |
| Устгал | Нийлүүлэгчийн цорын ганц баримтыг устгавал нийлүүлэгчийн мэдээлэл ч алга болно | suppliers тусдаа хүснэгт |

## Seed (00 файлын fixture)
- products: P01 Дэвтэр, P02 Үзэг, P03 Хавтас, P04 Маркер, P05 Цаас
- warehouses: A, B
- suppliers: SUP01
