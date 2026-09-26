const fs = require("fs");
const path = require("path");
const ROOT = "S:/MultiTool/HomeChats/Chat-8/";

// model - системный id, name - человеческое в title/тексте, file
const pages = [
  { file: "kia-rio.html", model: "kia-rio", label: "Kia Rio" },
  { file: "toyota-camry.html", model: "toyota-camry", label: "Toyota Camry" },
  { file: "lada-vesta.html", model: "lada-vesta", label: "Lada Vesta" },
  { file: "hyundai-solaris.html", model: "hyundai-solaris", label: "Hyundai Solaris" },
];

const cssModal = `
  .buy-modal { position: fixed; inset: 0; z-index: 100; background: rgba(31,42,55,.55); display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
  .buy-modal-box { background: #fff; border-radius: 14px; padding: 26px; max-width: 420px; width: 100%; box-shadow: 0 14px 40px rgba(0,0,0,.3); }
  .buy-modal-box h3 { margin-bottom: 4px; color: #2f5597; }
  .buy-modal-box label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 5px; }
  .buy-modal-box input { width: 100%; padding: 12px 13px; border: 1px solid #d7dee8; border-radius: 9px; font-size: 16px; margin-bottom: 8px; min-height: 48px; }
  .buy-modal-box input:focus { outline: 2px solid #2f5597; border-color: #2f5597; }
  .buy-modal-note { font-size: 12px; color: #667085; margin-bottom: 16px; }
  .buy-modal-actions { display: flex; gap: 10px; }
  .buy-modal-actions .btn { flex: 1 1 auto; text-align: center; border: none; }
  .btn-outline-s { background: #fff; color: #2f5597; border: 2px solid #2f5597; }
  .btn-buy-main { background: #2f5597; color: #fff; }
`;

const jsBlock = `
<script>
  var KASSA_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWIIiCUXVB49_oBCf5aoGb0jO9XTLfBJVfF5iuG2ndcuDsZ0lAK_ykUB0SBz7AWPRDBg/exec";
  var pendingModel = null;
  var buyModal = document.getElementById("buyModal");
  var buyEmail = document.getElementById("buyEmail");

  document.querySelectorAll("[data-model]").forEach(function (el) {
    el.addEventListener("click", function () {
      pendingModel = el.getAttribute("data-model");
      buyEmail.value = "";
      buyEmail.focus();
      buyModal.style.display = "flex";
    });
  });

  document.getElementById("buyCancel").addEventListener("click", function () {
    buyModal.style.display = "none"; pendingModel = null;
  });

  buyModal.addEventListener("click", function (e) {
    if (e.target === buyModal) { buyModal.style.display = "none"; pendingModel = null; }
  });

  document.getElementById("buySubmit").addEventListener("click", function () {
    var email = buyEmail.value.trim();
    var isEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(email);
    if (!isEmail) { buyEmail.style.outline = "2px solid #b42318"; buyEmail.focus(); return; }
    buyEmail.style.outline = "";
    buyModal.style.display = "none";
    var modelId = pendingModel; pendingModel = null;
    if (!modelId) return;

    var btn = document.querySelector("[data-model]");
    btn.textContent = "Открываем оплату…";

    fetch(KASSA_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "create_payment", model_id: modelId, email: email })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.confirmation_url) {
          try { localStorage.setItem("excelprice_last_payment", data.payment_id || ""); } catch (e) {}
          window.location.href = data.confirmation_url;
        } else {
          alert("Не удалось создать платёж. Попробуйте ещё раз.");
          btn.textContent = "Купить за 499 ₽";
        }
      })
      .catch(function () {
        alert("Ошибка связи с платёжным сервисом. Попробуйте ещё раз.");
        btn.textContent = "Купить за 499 ₽";
      });
  });
</script>`;

const modalHtml = `
<!-- Модальное окно покупки -->
<div class="buy-modal" id="buyModal" style="display:none">
  <div class="buy-modal-box">
    <h3>Купить прайс за 499 ₽</h3>
    <label for="buyEmail">Ваш email для получения файла</label>
    <input type="email" id="buyEmail" placeholder="you@example.com" autocomplete="email" inputmode="email">
    <p class="buy-modal-note">После оплаты файл пришлём на email и покажем на странице.</p>
    <div class="buy-modal-actions">
      <button class="btn btn-outline-s" id="buyCancel">Отмена</button>
      <button class="btn btn-buy-main" id="buySubmit">Перейти к оплате</button>
    </div>
  </div>
</div>
`;

for (const p of pages) {
  const fp = ROOT + p.file;
  let s = fs.readFileSync(fp, "utf8").replace(/^\uFEFF/, "");

  // 1) добавить CSS модалки перед </style>
  if (!s.includes(".buy-modal")) {
    s = s.replace("</style>", cssModal + "\n</style>");
  }

  // 2) заменить кнопку-ссылку на кнопку-модалку с data-model
  // купинг: <a class="btn" href="https://excelprice.ru/">Купить за 499 ₽</a>
  const btnRe = /<a class="btn" href="https?:\/\/excelprice\.ru\/">Купить за 499 ₽<\/a>/;
  if (btnRe.test(s)) {
    s = s.replace(btnRe, '<a class="btn btn-buy-main" href="javascript:void(0)" data-model="' + p.model + '">Купить за 499 ₽</a>');
  }

  // 3) вставить модалку + JS перед </body>
  if (!s.includes("buyModal")) {
    s = s.replace("</body>", modalHtml + "\n" + jsBlock + "\n</body>");
  }

  fs.writeFileSync(fp, "\uFEFF" + s, "utf8");
  console.log("updated", p.file);
}
console.log("DONE");