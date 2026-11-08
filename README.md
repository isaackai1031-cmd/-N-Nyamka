# Агуулахын бүртгэлийн систем (суралцах төсөл)

Хүнсний жижиг агуулахын бараа, орлого, зарлага, үлдэгдлийг бүртгэх систем.
32 долоо хоногийн сургалтын төсөл: JavaScript/Node.js + Express, Python/FastAPI, MySQL.

## Хамрах хүрээ
- Бараа (SKU), хоёр агуулах, нийлүүлэгч
- Opening, орлого, зарлага баримт (draft → батлах → буцаах)
- Үлдэгдэл ба хөдөлгөөний тайлан, хэрэглэгч, эрх, аудит
- Гадуур: өртөг/FIFO, НӨАТ, barcode, cloud production

## Баримтууд
| Файл | Агуулга |
|------|---------|
| docs/baseline.md | L01 суурь оношилгоо |
| docs/environment.md | L02 орчин, хувилбар |
| docs/problem.md | L03 асуудал, оролцогч, процесс |
| docs/requirements.md | L04 user story, хүлээн авах нөхцөл |
| docs/erd.md, docs/data-dictionary.md, docs/state-rules.md | L09–L10 өгөгдлийн загвар, төлөв |
| docs/api-contract.md, docs/architecture.md | L11 API гэрээ, архитектур |
| docs/js-cases.md | L12 JS кейсүүд (`node frontend/stock-cases.js`) |
| docs/usability.md, docs/http-observations.md | L13–L14 UI ба HTTP туршилт |
| docs/design-review.md | L15 зохиомжийн walkthrough |
| docs/reviews/G2-evidence.md, docs/reviews/G2-review.md | L16 G2 review |
| docs/ai-log.md | ХОУ ашигласан бүртгэл |

## Эхлүүлэх
1. `git clone https://github.com/isaackai1031-cmd/-N-Nyamka.git`
2. `docs/environment.md`-ийн хувилбаруудыг суулгана
3. Код L17-оос эхэлж нэмэгдэнэ

## UI ажиллуулах
```
cd frontend
python -m http.server 8000
```
Хөтөч дээр http://localhost:8000 нээнэ. (index.html-ийг шууд давхар дарж нээвэл fetch ажиллахгүй.)
