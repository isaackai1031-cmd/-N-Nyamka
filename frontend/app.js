// L13–L14: Төлөв (state) → дүрслэл (render) → үйл явдал (event) гурвыг салгасан.

// ---------- 1. ТӨЛӨВ: үнэн өгөгдөл энд л байна ----------
const state = {
  products: [],     // эх жагсаалт (хайлтаар устгахгүй)
  query: "",        // хайлтын текст
  status: "idle",   // idle | loading | success | empty | error
  message: "",      // хэрэглэгчид харуулах тайлбар
};

// ---------- 2. ӨГӨГДӨЛ ӨӨРЧЛӨХ ФУНКЦУУД (DOM-гүй) ----------
function validateProduct(input, existing) {
  const errors = {};
  const sku = input.sku.trim().toUpperCase();
  const name = input.name.trim();
  if (sku === "") errors.sku = "SKU оруулна уу.";
  else if (!/^[A-Z0-9-]{2,30}$/.test(sku)) errors.sku = "SKU нь 2–30 тэмдэгт: үсэг, тоо, зураас.";
  else if (existing.some((p) => p.sku === sku)) errors.sku = `${sku} SKU аль хэдийн бүртгэлтэй.`;
  if (name === "") errors.name = "Нэр хоосон байж болохгүй.";
  return { errors, value: { sku, name, unit: input.unit } };
}

function addProduct(product) {
  const nextId = state.products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  // Шинэ массив үүсгэнэ (эхийг push-ээр өөрчлөхгүй)
  state.products = [...state.products, { id: nextId, ...product, is_active: true }];
  state.status = "success";
  state.message = `${product.sku} нэмэгдлээ.`;
}

// L14: HTTP-ээр ачаалах. Алхам бүрийн алдааг тусад нь ялгана.
async function loadProducts(url) {
  state.status = "loading";
  state.message = "Ачаалж байна…";
  render();

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    // fetch зөвхөн СҮЛЖЭЭНИЙ алдаан дээр reject хийдэг
    state.status = "error";
    state.message = "Сүлжээний алдаа: сервертэй холбогдож чадсангүй.";
    console.log("[network error]", err.message);
    return render();
  }

  // 404/500 дээр fetch reject ХИЙХГҮЙ, тиймээс response.ok-ийг өөрсдөө шалгана
  if (!response.ok) {
    state.status = "error";
    state.message = `HTTP алдаа ${response.status}: өгөгдөл олдсонгүй.`;
    console.log("[http error]", response.status, url);
    return render();
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    // Status 200 боловч агуулга нь JSON биш / эвдэрсэн
    state.status = "error";
    state.message = "Өгөгдлийн формат буруу (JSON уншиж чадсангүй).";
    console.log("[parse error]", err.message);
    return render();
  }

  if (!Array.isArray(data)) {
    state.status = "error";
    state.message = "Өгөгдлийн формат буруу (жагсаалт биш).";
    return render();
  }

  state.products = data;
  state.status = data.length === 0 ? "empty" : "success";
  state.message = data.length === 0 ? "Бараа бүртгэгдээгүй байна." : `${data.length} бараа ачааллаа.`;
  render();
}

// ---------- 3. ДҮРСЛЭЛ: state-ээс DOM зурна, state-ийг өөрчлөхгүй ----------
const el = {
  rows: document.getElementById("product-rows"),
  table: document.getElementById("product-table"),
  status: document.getElementById("status"),
  form: document.getElementById("product-form"),
  sku: document.getElementById("sku"),
  name: document.getElementById("name"),
  unit: document.getElementById("unit"),
  skuError: document.getElementById("sku-error"),
  nameError: document.getElementById("name-error"),
  search: document.getElementById("search"),
  source: document.getElementById("source"),
  loadBtn: document.getElementById("load-btn"),
};

function render() {
  const visible = searchByName(state.products, state.query); // stock.js (L12)
  el.rows.replaceChildren(
    ...visible.map((p) => {
      const tr = document.createElement("tr");
      for (const value of [p.sku, p.name, p.unit]) {
        const td = document.createElement("td");
        td.textContent = value; // textContent: HTML тарилгаас (XSS) хамгаална
        tr.append(td);
      }
      return tr;
    })
  );

  let message = state.message;
  if (state.status === "success" && state.query) {
    message = visible.length === 0
      ? `"${state.query}" хайлтад тохирох бараа алга.`
      : `"${state.query}" хайлтаар ${visible.length} бараа олдлоо.`;
  }
  el.table.hidden = visible.length === 0;
  el.status.textContent = message;
  el.status.dataset.state = state.status;
  el.loadBtn.disabled = state.status === "loading";
}

function showFieldErrors(errors) {
  for (const [field, input, out] of [["sku", el.sku, el.skuError], ["name", el.name, el.nameError]]) {
    out.textContent = errors[field] || "";
    input.setAttribute("aria-invalid", errors[field] ? "true" : "false");
  }
  // Эхний алдаатай талбар руу keyboard focus шилжүүлнэ
  if (errors.sku) el.sku.focus();
  else if (errors.name) el.name.focus();
}

// ---------- 4. ҮЙЛ ЯВДАЛ: listener-ийг НЭГ л удаа холбоно ----------
let submitCount = 0;
el.form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCount += 1;
  console.log("submit #", submitCount); // давхар listener байвал нэг дарахад 2 гарна
  const { errors, value } = validateProduct(
    { sku: el.sku.value, name: el.name.value, unit: el.unit.value },
    state.products
  );
  showFieldErrors(errors);
  if (Object.keys(errors).length > 0) return; // алдаатай бол өгөгдөл НЭМЭХГҮЙ
  addProduct(value);
  el.form.reset();
  el.sku.focus();
  render();
});

el.search.addEventListener("input", () => {
  state.query = el.search.value;
  render();
});

el.loadBtn.addEventListener("click", () => loadProducts(el.source.value));

// Эхлэх үед амжилттай өгөгдлийг ачаална
loadProducts("data/products.json");
