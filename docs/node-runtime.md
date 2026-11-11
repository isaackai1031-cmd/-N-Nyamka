# Node.js runtime ба module (L17)

Хавтас: `backend/`. Гадны dependency байхгүй тул `npm install` хэрэггүй.

| Команд (`backend/` дотор) | Юу хийх |
|---------------------------|---------|
| `npm start` | L17-д runtime-ийн мэдээлэл хэвлэдэг байсан. L18-аас серверийг асаана (request-flow.md) |
| `npm test` | `node:test`-ээр 23 тест ажиллуулна |
| `npm run demo:event-loop` | Event loop-ийн дарааллын туршилт |
| `npm run demo:modules` | `require` cache-ийн туршилт |

## 1. Бүтэц
```
backend/
  package.json        scripts, engines (Node >= 20.11)
  src/index.js        entry point (L18-д Express энд нэмэгдэнэ)
  src/config.js       PORT, NODE_ENV-ийг process.env-ээс уншина
  src/domain/stock.js calcBalance, normalizeProduct: HTTP, DB мэдэхгүй цэвэр функцууд
  scripts/            туршилтын файлууд
  test/               node:test тестүүд
```
`domain/` нь architecture.md-ийн **Service** давхаргын суурь болно. Дүрэм нь HTTP-ээс тусдаа байгаа тул L18-ийн route болон тестүүд хоёулаа ижил функцийг дуудна.

## 2. Браузер ба Node-ийн ялгаа
| | Браузер (L13–L14) | Node (L17) |
|---|-------------------|------------|
| `document`, `window` | Байна | **Байхгүй** (`ReferenceError`) |
| `process`, `__filename` | Байхгүй | Байна |
| Файл унших | Хэрэглэгч сонгосон үед л | `node:fs`-ээр шууд |
| Module | `<script>` дараалал, global хувьсагч | `require` / `module.exports` |
| Хэн ажиллуулах | Хэрэглэгчийн компьютер | Сервер, бидний хяналтад |

Тиймээс `frontend/stock.js`-ийг шууд `require` хийгээгүй. Тэр файл браузерт global функц болж ачаалагддаг. Сервер талын дүрмийг `backend/src/domain/stock.js`-д тусад нь гаргасан. Хоёр хуулбар нэгдэх асуудлыг L51 (Нийтлэг UI)-д шийднэ.

## 3. Module: туршилтын үр дүн (`npm run demo:modules`)
| # | Туршилт | Хүлээсэн | Гарсан | ✓ |
|---|---------|----------|--------|---|
| 1 | Нэг файлыг хоёр удаа `require` | Ижил объект | `true` | ✓ |
| 2 | `require.resolve` | Бүтэн зам | `src/domain/stock.js` | ✓ |
| 3 | Cache-д байгаа эсэх | Байна | `true` | ✓ |
| 4 | Cache-ээс устгаад дахин `require` | Шинэ объект | `false` (өөр) | ✓ |
| 5 | Export-ууд | 3 функц | `calcBalance, normalizeProduct, isPositiveInt` | ✓ |

**Дүгнэлт:**
- `require` нь файлыг **нэг л удаа** ажиллуулдаг. Тиймээс L19-ийн DB connection pool-ийг тусдаа module-д нэг удаа үүсгээд, бүх газраас ижил pool-ийг хуваалцаж болно.
- `require("./config")` нь харьцангуй замаар өөрийн файлыг заана. `require("node:path")` нь Node-ийн суурь module. `require("express")` нь `node_modules`-оос хайна (L18).
- `exports = {...}` гэж оноох нь буруу, учир нь `module.exports`-тэй холбоо тасарна. Тиймээс `module.exports = {...}` хэлбэрээр бичсэн.
- `require.main === module`: файлыг шууд ажиллуулсан үед л `main()` дуудагдана. Тест `require` хийхэд дуудагдахгүй.

**CommonJS ба ES module:**
| | CommonJS (сонгосон) | ES module |
|---|---------------------|-----------|
| Бичлэг | `require` / `module.exports` | `import` / `export` |
| package.json | `"type": "commonjs"` | `"type": "module"` |
| Ачаалах | Sync, мөр ажиллах үед | Ачаалахаас өмнө шинжилнэ |

CommonJS-ийг сонгосон шалтгаан нь Express, mysql2-ийн албан жишээнүүд үүнийг ашигладаг, мөн `__filename` шууд ажилладаг.

## 4. Event loop (`npm run demo:event-loop`)
**Дасгал (хамгаалалтын өмнө):** `backend/scripts/event-loop.js`-ийг GitHub дээр нээж уншаад, доорх "Гарсан"-ыг харалгүйгээр 6 мөрийн дарааллыг цаасан дээр бичнэ. Дараа нь харьцуулна.
*Хамгийн түгээмэл буруу таамаглал:* `setTimeout(…, 0)` нь "0ms" учраас `Promise.then`-оос өмнө ажиллана гэж бодох. Үнэндээ эсрэгээрээ.

**Гарсан** (ХОУ ажиллуулсан, Node v22):
```
1. sync эхлэл
2. sync төгсгөл
2б. 50ms blocking ажил дууслаа
3. process.nextTick
4. Promise.then (microtask)
5. setTimeout 0
6. setImmediate
```
**Энгийн дүрэм:** sync код → `nextTick` → Promise (microtask) → timer → immediate. Microtask-ууд "одоогийн ажлын төгсгөлд", timer болон immediate "дараагийн тойрогт" ажиллана.

| Дараалал | Юу | Яагаад |
|----------|----|--------|
| 1, 2, 2б | Sync код | Одоогийн ажил дуустал юу ч тасалдахгүй |
| 3 | `process.nextTick` | Sync дуусмагц, бусад бүхнээс өмнө |
| 4 | `Promise.then` | Microtask: дараагийн үе шат руу шилжихээс өмнө |
| 5 | `setTimeout(…, 0)` | Timer queue. 0ms гэдэг нь "шууд" биш, "дараагийн тойрогт" гэсэн үг |
| 6 | `setImmediate` | Check queue |

5 ба 6-ийн дараалал нь үндсэн файлд ажиллахад үргэлж ингэж гарахгүй байж болно (Node-ийн баримтад тэмдэглэсэн). Харин I/O callback дотор `setImmediate` үргэлж түрүүлдэг.

**Сервертэй холбоо:** 50ms-ийн `while` давталт ажиллаж байх хооронд бусад callback-ууд хүлээсэн. Сервер дээр энэ нь **бүх хэрэглэгчийн хүсэлт хүлээнэ** гэсэн үг. Тиймээс L19-д DB query-г `await`-аар (non-blocking) хийнэ.

## 5. Тохиргоо ба process.env
| Оролт | Хүлээсэн | Гарсан | ✓ |
|-------|----------|--------|---|
| PORT өгөөгүй | 3000 | `{ port: 3000, nodeEnv: 'development' }` | ✓ |
| `PORT=8080` | 8080 (тоо) | `8080` | ✓ |
| `PORT=abc` | Алдаа, exit 1 | `[config error] PORT буруу байна: "abc"`, exit=1 | ✓ |
| `PORT=0`, `70000`, `80.5` | Алдаа | throws | ✓ |

- `process.env`-ийн бүх утга **текст** байдаг. `"8080" + 1` нь `"80801"` болно (L12-ын coercion-тэй ижил асуудал). Тиймээс `Number()`-ээр хөрвүүлээд бүхэл тоо эсэхийг шалгасан.
- Буруу тохиргоотой үед сервер "хагас ажиллахаас" илүү **эхлэхдээ шууд унах** нь дээр.
- `process.exit(1)`-ийн оронд `process.exitCode = 1` ашигласан. Энэ нь үлдсэн ажлыг (log бичих гэх мэт) дуусгасны дараа гаргана.
- `.env` нь `.gitignore`-д байгаа. DB-ийн нууц үг L19-д `.env`-ээс уншигдана.

## 6. Тест: L12-ын console кейсээс автомат тест рүү
L12-д үр дүнг нүдээрээ харж шалгадаг байсан (`node frontend/stock-cases.js`). Одоо `assert` ашиглаж, буруу бол тест улаан болно.

| Файл | Тест | Хамрах |
|------|------|--------|
| test/stock.test.js | 20 | js-cases 9–19, T02, T03, P09, P10. Бараа: P01, P03, SKU/нэр/нэгжийн хил зааг |
| test/config.test.js | 3 | PORT-ийн хэвийн ба алдаатай утга |
| **Нийт** | **23 pass, 0 fail** | |

`normalizeProduct` нь api-contract §3-ын талбарын дүрмийг (SKU том үсэг, `^[A-Z0-9-]{2,30}$`, нэр 1–150, нэгж 1–10) сервер талд хэрэгжүүлсэн. Давхар SKU (409)-г энд шалгаагүй, учир нь энэ нь DB-д юу байгаагаас хамаардаг. Энэ шалгалт L20-д repository-тэй хамт хийгдэнэ.

**Олсон зүйл:** кирилл `Р01` (латин P биш) SKU-г regex зөв татгалзаж байна. UI дээр хэрэглэгч гарын байрлал солихоо мартвал ингэж бичигдэх магадлалтай тул тестэд нэмсэн.

## 7. Дараагийн алхам (L18)
- `npm install express` → `package-lock.json`-ийг commit хийнэ, `node_modules`-ийг хийхгүй
- `src/index.js`-д `app.listen(config.port)`
- `GET /api/v1/products` route нь `domain/`-ийг дуудна
