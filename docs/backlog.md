# L05: Backlog ба milestone

## Үндсэн backlog (эрэмбээр)
| # | Ажил | Story | Шат | Дуусах шалгуур |
|---|------|-------|-----|----------------|
| 1 | ERD: products, warehouses, documents, lines, movements, balances | Бүгд | G2 | ERD зураг, түлхүүр, unique тайлбартай |
| 2 | API гэрээ: /products, /documents, /stock | Бүгд | G2 | Endpoint, status код, алдааны формат бичигдсэн |
| 3 | UI: барааны жагсаалт ба form (fake өгөгдөл) | US-01, 02 | G2 | Loading/error төлөв харагдана |
| 4 | Node: барааны CRUD + validation | US-01, 02 | G3 | P01-P04 тест давна |
| 5 | Node: opening, орлого, transaction | US-03, 04 | G4 | P05-P08 тест давна |
| 6 | Node: зарлага, давхар батлалт | US-05, 06 | G4 | P09-P11 тест давна |
| 7 | Node: буцаалт, тайлан | US-07, 08 | G4 | P12, тайлан = хөдөлгөөний нийлбэр |
| 8 | FastAPI + SQLAlchemy: ижил CRUD | US-01, 02 | G5 | P01-P04 Python дээр давна |
| 9 | FastAPI: баримт, шилжүүлэг, тооллого | US-03..08 | G6 | P01-P12, T08, T09 давна |
| 10 | Нэвтрэлт, role | — | G7 | R01-R03 давна |
| 11 | CI, backup, гарын авлага | — | G8 | GitHub Actions ногоон |

## Нэмэлт (цаг үлдвэл)
- UI гоёл, хайлт, шүүлтүүр
- Тайланг CSV-ээр гаргах
- Гүйцэтгэлийн оновчлол

## Milestones
| Milestone | Долоо хоног | Агуулга |
|-----------|-------------|---------|
| G1 Шаардлага ба Git | 1-4 | problem, requirements, PR |
| G2 Зохиомж ба UI | 5-8 | ERD, API гэрээ, JS UI |
| G3 Node API | 9-12 | Express, MySQL, CRUD, тест |
| G4 Агуулахын логик (Node) | 13-16 | Transaction, зарлага, буцаалт |
| G5 Python стек | 17-20 | FastAPI, SQLAlchemy, Alembic |
| G6 Агуулахын логик (Python) | 21-24 | Шилжүүлэг, тооллого, гэрээний тест |
| G7 Нэгтгэл | 25-28 | Нэвтрэлт, эрх, regression |
| G8 Эцсийн | 29-32 | CI, backup, хамгаалалт |
