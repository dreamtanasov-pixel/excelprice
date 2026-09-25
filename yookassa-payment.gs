/**
 * ExcelPrice — авто-продажа готовых прайсов через ЮKassa (тестовый магазин).
 * Web App (Apps Script): разверните с доступом «Все, у кого есть ссылка».
 *
 * КАК НАСТРОИТЬ:
 *   1. Впишите ниже SHOP_ID (число, из «Настройки -> Магазин») и SECRET_KEY.
 *   2. Заполните FILE_BASE64: base64 каждого .xlsx (см. раздел 2).
 *   3. Разверните web app -> получите URL вида
 *      https://script.google.com/macros/s/<ID>/exec
 *   4. В ЮKassa: «Приём платежей -> Настройки -> Уведомления» укажите этот URL
 *      и выберите событие payment.succeeded.
 *   5. Кнопка «Купить» на сайте шлёт POST на web app: {"action":"create_payment","model_id":"kia-rio"}
 */

// ===== 1. РЕКВИЗИТЫ (ЗАМЕНИТЕ) =====
var SHOP_ID = 1476352;        // из «Настройки -> Магазин» (число)
var SECRET_KEY = "test_OfBi_rHUCbkzEE01bSfHWhaw2z3kzgch_sDDRtird3E";  // тестовый ключ
var RETURN_URL = "https://excelprice.ru/kassa-success.html"; // ЮKassa сама добавит ?payment_id=

// ===== 2. ТОВАР =====
var PRICE = 499; // руб., фиксированная цена готового прайса
var FILE_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// модель -> (название, ради печатного имени)
var MODELS = {
  "kia-rio":       "Kia Rio (2019, 1.4 Comfort)",
  "mercedes-e210": "Mercedes E210 (1996, W210)",
  "toyota-camry":  "Toyota Camry (2018, XV70)",
  "lada-vesta":    "Lada Vesta (2018, 1.6 21129)",
  "lada-granta":   "Lada Granta (2016, 1.6)",
  "hyundai-solaris":"Hyundai Solaris (2015, 1.6 G4FC)",
  "lada-largus":   "Lada Largus (2016, 1.6 K4M)",
  "toyota-corolla":"Toyota Corolla (2016, E180)",
  "hyundai-creta": "Hyundai Creta (2019, 1.6 G4FG)",
  "lada-niva":     "Lada Niva 4x4 (2018, 1.7)"
};

// Здесь вставить base64 содержимое каждого xlsx — ОНЖЕВ отдельном файле files.gs!
// Файл files.gs содержит var FILE_BASE64 = { ... }; и объявляется там.
// Убедитесь, что файл files.gs с данными есть в проекте (добавьте через «+» -> «Скрипт»).
// НЕ объявляйте FILE_BASE64 здесь повторно — только в files.gs.

// ===== ХРАНИЛИЩЕ ПРОДАЖ (Google Таблица, необязательно) =====
var SHEET_ID = "196NKSTs3-nm1a6fb1b_PL2kMx7NjfuhZSzxXG_L1ff8";
var SHEET_NAME = "Продажи";

function logSale_(paymentId, modelId, amount, status, token, customer) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(["Дата","payment_id","model_id","Сумма","Статус","Токен","Клиент"]); }
    sh.appendRow([new Date(), paymentId, modelId, amount, status, token, customer]);
  } catch (e) { console.warn("logSale_" + e); }
}

// ===== ENTRY POINTS =====
function doGet(e) {
  var p = e && e.parameter || {};
  if (p.p === "token") {
    // клиент вернулся после оплаты: p=token&payment_id=...
    // 1) узнаём статус платежа напрямую из ЮKassa (не ждём вебхук)
    var pay = getPaymentStatus_(p.payment_id);
    if (pay && pay.status === "succeeded") {
      // модель может прийти либо из сохранённого вебхука, либо из metadata платежа
      var modelId = (pay.metadata && pay.metadata.model_id) || "";
      if (!modelId) {
        // нет модели — пробуем из нашей записи
        var rec = findPaid_(p.payment_id);
        modelId = rec ? rec.model_id : "";
      }
      if (modelId && FILE_BASE64.hasOwnProperty(modelId)) {
        // фиксируем платёж, если вебхук ещё не пришёл
        if (!PropertiesService.getScriptProperties().getProperty("pay:" + p.payment_id)) {
          handleSuccess_(pay);
        }
        return json_(200, {model: modelId, name: MODELS[modelId] || modelId});
      }
      return json_(404, {error:"no_model_in_payment"});
    }
    return json_(404, {error:"not_paid", hint:"Оплата не подтверждена. Если вы только что оплатили — обновите страницу."});
  }
  if (p.p === "download") {
    // выдача файла по payment_id
    var rec2 = findPaid_(p.payment_id);
    if (!rec2) return ContentService.createTextOutput("Ссылка недействительна или истекла.")
      .setMimeType(ContentService.MimeType.TEXT);
    var b64 = FILE_BASE64[rec2.model_id];
    if (!b64) return ContentService.createTextOutput("Файл не найден.")
      .setMimeType(ContentService.MimeType.TEXT);
    var bytes = Utilities.base64Decode(b64);
    var blob = Utilities.newBlob(bytes, FILE_MIME, "ExcelPrice-prajs-" + rec2.model_id + ".xlsx");
    return json_(200, {file: Utilities.base64Encode(bytes), name: "ExcelPrice-prajs-" + rec2.model_id + ".xlsx", mime: FILE_MIME});
  }
  return json_(200, {ok:true, service:"excelprice-kassa"});
}

// Получить статус платежа напрямую из ЮKassa: GET /v3/payments/{id}
function getPaymentStatus_(paymentId) {
  if (!paymentId) return null;
  try {
    var resp = ykRequest_("GET", "https://api.yookassa.ru/v3/payments/" + paymentId, null);
    if (resp.code === 200 && resp.data && resp.data.id) return resp.data;
    return null;
  } catch (er) {
    return null;
  }
}

function doPost(e) {
  var body = (e.postData && e.postData.contents) || "";
  var req; try { req = JSON.parse(body); } catch (_) { return json_(400, {error:"bad_json"}); }
  if (req.action === "create_payment") return createPayment_(req.model_id, req.email);
  if (req.event && req.object) {
    if (req.event === "payment.succeeded") handleSuccess_(req.object);
    return json_(200, {ok:true});
  }
  return json_(400, {error:"unknown"});
}

function createPayment_(modelId, email) {
  if (!modelId || !FILE_BASE64.hasOwnProperty(modelId) || !FILE_BASE64[modelId]) {
    return json_(400, {error:"no_model"});
  }
  var payload = {
    amount: { value: PRICE.toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: RETURN_URL },
    description: "Прайс запчастей: " + (MODELS[modelId] || modelId),
    metadata: { model_id: modelId }
  };
  try {
    var resp = ykRequest_("POST", "https://api.yookassa.ru/v3/payments", payload);
    if (resp.code >= 400) return json_(502, {error:"yookassa", status: resp.data});
    var d = resp.data;
    // сохраняем email покупателя, связанный с этим платежом
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      PropertiesService.getScriptProperties().setProperty("eml:" + d.id, email);
    }
    return json_(200, { payment_id: d.id, status: d.status, confirmation_url: d.confirmation && d.confirmation.confirmation_url });
  } catch (er) { return json_(500, {error:"exception:" + er}); }
}

// ===== ОБРАБОТКА ВЕБХУКА =====
function handleSuccess_(payment) {
  var amount = payment.amount && payment.amount.value;
  var modelId = payment.metadata && payment.metadata.model_id;
  var paymentId = payment.id;
  if (!modelId || !FILE_BASE64.hasOwnProperty(modelId)) { console.log("skip model"); return; }
  if (Math.abs(parseFloat(amount) - PRICE) > 0.01) { console.log("sum mismatch " + amount); return; }
  var token = Utilities.getUuid().replace(/-/g, "");
  var customer = (payment.payment_method && payment.payment_method.id) || "";
  logSale_(paymentId, modelId, amount, "paid", token, customer);
  PropertiesService.getScriptProperties().setProperty("pay:" + paymentId, token + "|" + modelId);
  // отправляем файл на email покупателя, если он указан
  sendFileByEmail_(paymentId, modelId);
}

// Отправить файл на email покупателя (временная ссылка на скачивание)
function sendFileByEmail_(paymentId, modelId) {
  var email = PropertiesService.getScriptProperties().getProperty("eml:" + paymentId);
  if (!email) return; // email не указан — файл доступен на странице успеха
  try {
    var b64 = FILE_BASE64[modelId];
    if (!b64) return;
    var bytes = Utilities.base64Decode(b64);
    var fileBlob = Utilities.newBlob(bytes, FILE_MIME, "ExcelPrice-prajs-" + modelId + ".xlsx");
    var subject = "Ваш прайс ExcelPrice: " + (MODELS[modelId] || modelId);
    var body = "Здравствуйте!\n\nСпасибо за покупку. Прайс-лист прикреплён к этому письму.\n\nЕсли письмо открыть на телефоне — файл также доступен по ссылке в течение 30 дней:\nhttps://excelprice.ru/kassa-success.html\n\nС уважением, ExcelPrice.";
    MailApp.sendEmail(email, subject, body, { attachments: [fileBlob] });
  } catch (e) {
    console.warn("email fail: " + e);
  }
}

function findPaid_(paymentId) {
  if (!paymentId) return null;
  var store = PropertiesService.getScriptProperties().getProperty("pay:" + paymentId);
  if (!store) return null;
  var parts = store.split("|");
  return { model_id: parts[1] || "" };
}

// ===== API-ЗАПРОС К ЮKASSA =====
function ykRequest_(method, url, payload) {
  var opt = {
    method: method,
    contentType: "application/json",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode(SHOP_ID + ":" + SECRET_KEY),
      "Idempotence-Key": Utilities.getUuid()
    },
    muteHttpExceptions: true
  };
  if (payload) opt.payload = JSON.stringify(payload);
  var r = UrlFetchApp.fetch(url, opt);
  var data = null;
  var ct = r.getContentText();
  try { data = JSON.parse(ct); } catch (_) { data = ct; }
  return { code: r.getResponseCode(), data: data };
}

function json_(code, obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}