# ERD (L09–L10)

Хүснэгтийн дэлгэрэнгүйг `data-dictionary.md`-ээс үзнэ.

```mermaid
erDiagram
  WAREHOUSES ||--o{ STOCK_BALANCES : "агуулна"
  PRODUCTS ||--o{ STOCK_BALANCES : "үлдэгдэлтэй"
  WAREHOUSES ||--o{ DOCUMENTS : "баримттай"
  SUPPLIERS |o--o{ DOCUMENTS : "нийлүүлнэ"
  DOCUMENTS ||--|{ DOCUMENT_LINES : "мөртэй"
  PRODUCTS ||--o{ DOCUMENT_LINES : "мөрөнд орно"
  DOCUMENTS ||--o{ STOCK_MOVEMENTS : "хөдөлгөөн үүсгэнэ"
  DOCUMENT_LINES ||--o{ STOCK_MOVEMENTS : ""
  DOCUMENTS |o--o| DOCUMENTS : "reversal_of"

  PRODUCTS {
    int id PK
    string sku UK
    string name
    string unit
    bool is_active
  }
  WAREHOUSES {
    int id PK
    string code UK
    string name
  }
  SUPPLIERS {
    int id PK
    string code UK
    string name
  }
  STOCK_BALANCES {
    int id PK
    int warehouse_id FK
    int product_id FK
    int quantity
  }
  DOCUMENTS {
    int id PK
    string doc_no UK
    string type
    string status
    int warehouse_id FK
    int supplier_id FK
    int reversal_of_id FK
  }
  DOCUMENT_LINES {
    int id PK
    int document_id FK
    int product_id FK
    int quantity
  }
  STOCK_MOVEMENTS {
    int id PK
    int document_id FK
    int document_line_id FK
    int warehouse_id FK
    int product_id FK
    int quantity_change
  }
```

## Хүлээн авах шалгуур (L09)
- Нэг SKU хоёр агуулахад байж болно: P01 нь A-д нэг мөр, B-д нэг мөр.
- Нэг агуулах-барааны balance давхардахгүй: UNIQUE (warehouse_id, product_id).
