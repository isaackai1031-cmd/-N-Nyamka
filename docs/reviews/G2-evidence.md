# G2 evidence index (L16)

Шат: **G2 Зохиомж ба UI** (L09–L16). Шалгалтын өмнө багшид өгөх нотолгооны жагсаалт.
Төлөв: `NOT REVIEWED` → багш шалгасны дараа `PASS` / `RETRY` болгоно.

## Шалгуур ба нотолгоо
| # | Шалгуур | Нотолгоо (файл) | Commit | Шалгах арга | Өөрийн шалгалт |
|---|---------|-----------------|--------|-------------|----------------|
| 1 | ERD: түлхүүр, хамаарал, баримт-мөрийн холбоо | docs/erd.md, docs/data-dictionary.md (L09–L10) | `fea9466` | ERD-ээс SKU UNIQUE, (warehouse_id, product_id) UNIQUE, (document_id, product_id) UNIQUE-ийг заана | ✓ |
| 2 | Төлвийн дүрэм | docs/state-rules.md (L10) | `fea9466` | draft → posted → reversal урсгалыг T03 хүснэгтээр тайлбарлана | ✓ |
| 3 | 5 endpoint-ийн оролт/гаралт/алдааны гэрээ | docs/api-contract.md, docs/architecture.md (L11) | `fea9466`, `1a066ca` | Endpoint бүрт 2xx/404/409/422, алдааны нийтлэг формат | ✓ |
| 4 | JS хайлт, тооцоолол | frontend/stock.js, frontend/stock-cases.js, docs/js-cases.md (L12) | `8a89f13`, L16 commit | `node frontend/stock-cases.js` → 19 кейс бүгд хүлээсэн үр дүнтэй | ✓ (L16-д дахин ажиллуулав) |
| 5 | DOM form ажилладаг, хүртээмжтэй | frontend/index.html, frontend/app.js, docs/usability.md (L13) | `8a89f13`, `1a066ca` | Keyboard-оор P06 нэмэх, хоосон нэр, давхар SKU | ✓ |
| 6 | HTTP алдаа ба network error-ийг ялгасан | docs/http-observations.md, docs/img/ui-*.png (L14) | `1a066ca`, `9a0700c` | 5 эх сурвалж: 200 / [] / 404 / эвдэрсэн JSON / сүлжээ | ✓ |
| 7 | Зохиомжийн зөрчил 3 | docs/design-review.md (L15) | `1a066ca` | qty талбар, id/SKU/name ялгаа, талбарын дүрэм | ✓ |
| 8 | Issue / PR | G1: [#1](https://github.com/isaackai1031-cmd/-N-Nyamka/issues/1), [#3](https://github.com/isaackai1031-cmd/-N-Nyamka/issues/3), PR [#2](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/2), [#4](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/4). G2: PR [#7](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/7) (L16), issue **дутуу** | — | — | ⚠ доороос үзнэ |
| 9 | Peer review | **дутуу** (design-review §4, traceability-ийн Peer review хэсэг хоосон) | — | — | ⚠ |
| 10 | ХОУ ашиглалт | docs/ai-log.md | L16 commit | Хүсэлт, шалгасан зүйл, өөрөө хийсэн хэсэг | ✓ |

## L16-д хийсэн засвар
| Асуудал | Засвар |
|---------|--------|
| `stock.js`, `stock-cases.js` нь root-д байсан, харин docs/js-cases.md болон энэ index-д `frontend/` гэж бичсэн | `stock-cases.js`-ийг `frontend/` руу зөөв. Root дахь `stock.js` нь `frontend/stock.js`-тэй яг ижил хуулбар байсан тул устгав. Одоо нэг л эх хувилбар үлдэв |
| Evidence index-д commit SHA байгаагүй | Шалгуур бүрийг commit-той холбов |

## Дутуу зүйл (шалгалтаас өмнө өөрөө хийх)
1. **G2 Issue:** L09–L15-ийн ажил PR-гүйгээр main руу шууд upload хийгдсэн. G2 PR нь [#7](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/7). G2-д зориулж issue нээгээд, PR #7-ийн тайлбарт `Closes #<issue>` гэж холбоно.
2. **Peer review:** Ангийн нэг хүүхдийн G2 PR-д review бичиж, өөрийн PR-д review авна. Холбоосыг design-review.md §4-д бичнэ.
3. **Хуучин нээлттэй PR-ууд:** [#2](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/2), [#4](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/4), [#6](https://github.com/isaackai1031-cmd/-N-Nyamka/pull/6) merge эсвэл хаах шийдвэр гаргана.
4. **Тестгүй AC:** traceability.md-д AC-02.1, AC-02.3, AC-06.3, AC-08.2, AC-08.3 үлдсэн. Энэ нь G3/G4-д хамаарна. G2-ийн шалгуурт орохгүй ч тэмдэглэж үлдээв.

Дэлгэрэнгүй дүгнэлт: [G2-review.md](G2-review.md)
