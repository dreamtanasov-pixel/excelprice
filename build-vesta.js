const os = require("os");
const path = require("path");
const CFG = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
const SKILL = path.join(CFG, "gigatool", "skills", "xlsx");
const ExcelJS = require(path.join(SKILL, "vendor", "exceljs.bundle.cjs"));
const H = require(path.join(SKILL, "helpers", "index.cjs"));

const CATS = [
  "Двигатель",
  "Трансмиссия и привод",
  "Подвеска и рулевое",
  "Тормоза",
  "Кузов и оптика",
  "Электрика",
  "Салон",
];

const ITEMS = [
  ["Двигатель", "Двигатель в сборе ВАЗ-21129 (контрактный)", "21129", 60000, 60000, "baza.drom.ru — Lada XRAY 20101 21129 б/у 60 000 ₽, Челябинск"],
  ["Двигатель", "Блок цилиндров", "21129", null, null, "Авито — новый в сборе 47 800 ₽; бу-блок редок"],
  ["Двигатель", "ГБЦ в сборе", "21129100300700", null, null, "Авито — б/у и новая есть, цена не раскрыта, по запросу разборок"],
  ["Двигатель", "Генератор 120А (контракт)", "TG12C209", 10000, 10000, "xbaz.ru (Краснодар) — 10 000 ₽"],
  ["Двигатель", "Стартер", "21901-3708010-00", null, null, "Авито — разборы с наличием, цена не раскрыта"],
  ["Двигатель", "Форсунки Deka (комплект)", "28346052", null, null, "Авито — цена за шт не раскрыта; новый комплект Delphi ~32 400 ₽"],
  ["Двигатель", "Дроссельная заслонка", "211271148010", 8000, 8000, "Авито + отчёт Drive2 — с разборки 8 000 ₽ за заводскую"],
  ["Двигатель", "Датчик MAF / ДМРВ", "Bosch", null, null, "бу-цены в выдержке нет — по запросу разборок"],
  ["Двигатель", "Термостат", "", 2300, 2300, "Drive2 — отчёт владельца: 2 300 ₽"],
  ["Двигатель", "Катализатор / катколлектор", "211291203008", 1500, 1500, "Авито — 1 500 ₽ без датчиков, пробег 38 ткм"],
  ["Двигатель", "Лямбда-зонд (датчик кислорода)", "226A41772R", null, null, "Авито Пермь — за шт, цена не раскрыта; новый ~9 156 ₽"],
  ["Двигатель", "Выпускной коллектор / средняя часть глушителя", "8450022897", null, null, "Авито — б/у есть, цена не раскрыта, по запросу"],

  ["Трансмиссия и привод", "Вариатор Jatco JF015E", "JF015E/RE0F11A", null, null, "Авито — новый оригинал 115 000 ₽; б/у редка, чаще новый/редилд"],
  ["Трансмиссия и привод", "МКПП контрактная (Renault JH3/JR5)", "JH3/JR5", 26000, 26000, "auto.drom.ru — контрактная оригинал 26 000 ₽"],
  ["Трансмиссия и привод", "Сцепление (комплект корзина+диск)", "21810160100000", null, null, "бу-цены нет; новые комплекты от ~12 100 ₽ — расходник"],
  ["Трансмиссия и привод", "Полуоси / ШРУС", "", null, null, "отдельных бу-объявлений не найдено — по запросу разборок"],

  ["Подвеска и рулевое", "Рычаг передней подвески", "", 1500, 1500, "Авито — б/у 1 500 ₽/шт"],
  ["Подвеска и рулевое", "Амортизаторы / стойки перед-зад", "", null, null, "Авито — оригин. с 20 ткм, цена не раскрыта; новый СААЗ от ~4 400 ₽"],
  ["Подвеска и рулевое", "Пружины", "", null, null, "Авито Саратовская обл. — б/у есть, сумма не раскрыта"],
  ["Подвеска и рулевое", "Рулевая колонка + ЭУР (в сборе)", "8450006840", 15000, 15000, "festima.ru — 15 000 ₽; рейка-ребилд с гарантией на Авито"],
  ["Подвеска и рулевое", "ЭУР (электроусилитель, отдельно)", "8450006840", 7777, 49000, "farpost Ростов 7 777 ₽; baza.drom Новосибирск 49 000 ₽ — разброс рынка"],

  ["Тормоза", "Суппорт передний/задний", "", null, null, "Авито Москва — сняты на 60 ткм, цена не раскрыта, по запросу"],
  ["Тормоза", "Тормозные диски / барабаны", "", null, null, "бу-рынок слабый — обычно новые, по запросу разборок"],
  ["Тормоза", "Вакуумный усилитель + ГТЦ", "", null, null, "Авито Чемодановка — б/у есть, цена не раскрыта"],
  ["Тормоза", "Блок ABS", "", null, null, "покупка с разборки обсуждается на форумах, цена по запросу"],

  ["Кузов и оптика", "Капот (оригинал)", "8450039378", 10000, 10000, "Авито, Москва — б/у оригинал 10 000 ₽"],
  ["Кузов и оптика", "Фара передняя (NG)", "8450006953", 14736, 14736, "Авито — фара NG 14 736 ₽"],
  ["Кузов и оптика", "Задний фонарь наружный", "8450006963", 8297, 8297, "bi-bi.ru — новый/оригинал 8 297 ₽; бу по запросу"],
  ["Кузов и оптика", "Крыло переднее", "8450039386", null, null, "Авито — б/у оригинал, цена не раскрыта; новое от 7 580 ₽"],
  ["Кузов и оптика", "Бампер передний/задний", "", null, null, "Авито — б/у Cross есть, цены не раскрыты, по запросу"],
  ["Кузов и оптика", "Дверь передняя", "", null, null, "Авито — б/у оригинал, цена не раскрыта, по запросу"],
  ["Кузов и оптика", "Лобовое стекло", "", 17800, 17800, "Авито, Уфа — новое с полным обогревом 17 800 ₽; истинного бу мало"],
  ["Кузов и оптика", "Решётка радиатора", "", null, null, "Авито — NG/хром есть, цены не раскрыты; новая от ~2 100 ₽"],
  ["Кузов и оптика", "Крышка багажника", "8450013788", null, null, "Авито, Тольятти — SW б/у, цена не раскрыта; задняя часть кузова ~25 000 ₽"],

  ["Электрика", "ЭБУ (мозги)", "8450030592", null, null, "Авито — б/у рабочий с гарантией, цена не раскрыта"],
  ["Электрика", "Панель приборов (комбинация)", "8450007022", 5555, 5555, "Авито — комбинация от 5 555 ₽/шт б/у"],
  ["Электрика", "Мультимедиа ММС (магнитола)", "8450007950", 15000, 15000, "carbox63.ru — оригинал 15 000 ₽; бу на Авито без цены"],
  ["Электрика", "Трапеция дворников (с мотором)", "", null, null, "Авито, Реутов — б/у есть, цена не раскрыта"],
  ["Электрика", "Моторчик стеклоподъёмника / замки / жгуты", "", null, null, "бу-цен нет — по запросу разборок"],

  ["Салон", "Сиденья передние (комплект)", "", 29000, 29000, "Авито, Пермь — 29 000 ₽ за комплект"],
  ["Салон", "Подушка безопасности (водитель, руль)", "", null, null, "Авито, Ростов — SRS новая 3 шт, цена не раскрыта"],
  ["Салон", "Руль / мультируль", "cmg-05", null, null, "granves-shop — с обогревом по запросу; бу-рули на Авито"],
  ["Салон", "Чехлы", "", 2000, 2000, "Авито, Пермь — б/у 2 000 ₽"],
  ["Салон", "Коврики / обшивка / дверные карты", "", null, null, "бу-цен нет — по запросу разборок"],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  const dash = H.addSheet(wb, "Дашборд");
  const price = H.addSheet(wb, "Прайс");
  const src = H.addSheet(wb, "Источники");

  const firstData = 4;
  const lastData = firstData + ITEMS.length - 1;

  H.titleBand(price, "A1:K1", "БУ-запчасти Lada Vesta (седан, 2018 г., 1.6 21129)",
    "Цены — реальные публичные предложения б/у (сентябрь 2026): Авито, Дром, xbaz, festima, farpost и разборки. «Лучшая цена» = минимальная из найденных; ссылки открывают поиск детали на Avito и Дроме.");
  const priceHeader = ["№", "Категория", "Деталь", "Артикул / ориентир", "Цена мин, руб", "Цена макс, руб", "Ср. цена, руб", "Примечание", "Лучшая цена, руб", "Avito", "Дром"];
  priceHeader.forEach((h, i) => (price.getCell(H.colName(i + 1) + "3").value = h));
  H.headerRow(price, "A3:K3");
  H.widths(price, [["A", 5], ["B", 22], ["C", 42], ["D", 18], ["E", 13], ["F", 13], ["G", 12], ["H", 50], ["I", 14], ["J", 24], ["K", 24]]);
  H.freeze(price, 3);

  ITEMS.forEach((it, i) => {
    const r = firstData + i;
    price.getCell("A" + r).value = i + 1;
    price.getCell("B" + r).value = it[0];
    price.getCell("C" + r).value = it[1];
    price.getCell("D" + r).value = it[2];
    const mn = it[3];
    const mx = it[4];
    const q = encodeURIComponent("lada vesta " + it[1] + " бу");
    const avitoUrl = "https://www.avito.ru/all/zapchasti_i_aksessuary?q=" + q;
    const dromUrl = "https://baza.drom.ru/sell_spare_parts/+/" + q + "/";
    if (mn != null && mx != null) {
      price.getCell("E" + r).value = mn;
      price.getCell("F" + r).value = mx;
      const avg = Math.round((mn + mx) / 2);
      price.getCell("G" + r).value = { formula: "ROUND((E" + r + "+F" + r + ")/2,0)", result: avg };
      price.getCell("I" + r).value = { formula: "E" + r, result: mn };
      price.getCell("E" + r).numFmt = H.FMT.rub0;
      price.getCell("F" + r).numFmt = H.FMT.rub0;
      price.getCell("G" + r).numFmt = H.FMT.rub0;
      price.getCell("I" + r).numFmt = H.FMT.rub0;
    } else {
      price.getCell("E" + r).value = "—";
      price.getCell("F" + r).value = "—";
      price.getCell("G" + r).value = "—";
      price.getCell("I" + r).value = "—";
      price.getCell("E" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
      price.getCell("F" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
      price.getCell("G" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
      price.getCell("I" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
    }
    price.getCell("H" + r).value = it[5];
    price.getCell("H" + r).alignment = { vertical: "middle", wrapText: true };
    const linkA = price.getCell("J" + r);
    linkA.value = { text: "Avito", hyperlink: avitoUrl };
    linkA.font = { name: "Calibri", size: 10, color: { argb: "FF2F5597" }, underline: true };
    linkA.alignment = { vertical: "middle", horizontal: "center" };
    const linkD = price.getCell("K" + r);
    linkD.value = { text: "Дром", hyperlink: dromUrl };
    linkD.font = { name: "Calibri", size: 10, color: { argb: "FF2A7F77" }, underline: true };
    linkD.alignment = { vertical: "middle", horizontal: "center" };
    price.getCell("A" + r).alignment = { horizontal: "center", vertical: "middle" };
    price.getCell("A" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
  });
  H.body(price, "A3:K" + lastData);
  price.autoFilter = "A3:K" + lastData;
  for (let i = 0; i < ITEMS.length; i++) price.getRow(firstData + i).height = 24;

  H.titleBand(dash, "A1:F1", "Сводка по бу-запчастям Lada Vesta 2018",
    "Считается автоматически с листа «Прайс». Сентябрь 2026, вся Россия.");
  const pricedItems = ITEMS.filter(x => x[3] != null && x[4] != null);
  H.kpi(dash, "A3", "Позиций в таблице", { formula: "COUNTA(" + H.ref("Прайс", "$C$" + firstData + ":$C$" + lastData) + ")", result: ITEMS.length }, H.FMT.int);
  H.kpi(dash, "C3", "Категорий", { formula: "COUNTA(" + H.ref("Дашборд", "$B$9:$B$15") + ")", result: CATS.length }, H.FMT.int);
  H.kpi(dash, "E3", "Позиций с ценой", { formula: "COUNT(" + H.ref("Прайс", "$E$" + firstData + ":$E$" + lastData) + ")", result: pricedItems.length }, H.FMT.int);

  dash.getCell("A8").value = "По категориям";
  dash.getCell("A8").font = { name: "Calibri", size: 11, bold: true, color: { argb: H.THEME.ink } };
  const sumHead = ["Категория", "Позиций", "Ср. мин, руб", "Ср. макс, руб", "Ср. цена, руб", "Диапазон"];
  sumHead.forEach((h, i) => (dash.getCell(H.colName(i + 1) + "9").value = h));
  H.headerRow(dash, "A9:F9");
  const rng = "$B$" + firstData + ":$B$" + lastData;
  const eRng = "$E$" + firstData + ":$E$" + lastData;
  const fRng = "$F$" + firstData + ":$F$" + lastData;
  CATS.forEach((c, i) => {
    const r = 10 + i;
    const items = ITEMS.filter(x => x[0] === c);
    const priced = items.filter(x => x[3] != null && x[4] != null);
    const cnt = items.length;
    const avgMin = priced.length ? Math.round(priced.reduce((s, x) => s + x[3], 0) / priced.length) : 0;
    const avgMax = priced.length ? Math.round(priced.reduce((s, x) => s + x[4], 0) / priced.length) : 0;
    dash.getCell("A" + r).value = c;
    dash.getCell("B" + r).value = { formula: "COUNTIF(" + H.ref("Прайс", rng) + ",A" + r + ")", result: cnt };
    dash.getCell("C" + r).value = { formula: "AVERAGEIF(" + H.ref("Прайс", rng) + ",A" + r + "," + H.ref("Прайс", eRng) + ")", result: avgMin };
    dash.getCell("D" + r).value = { formula: "AVERAGEIF(" + H.ref("Прайс", rng) + ",A" + r + "," + H.ref("Прайс", fRng) + ")", result: avgMax };
    dash.getCell("E" + r).value = { formula: "ROUND((C" + r + "+D" + r + ")/2,0)", result: Math.round((avgMin + avgMax) / 2) };
    dash.getCell("F" + r).value = { formula: "D" + r + "-C" + r, result: avgMax - avgMin };
    dash.getCell("B" + r).numFmt = H.FMT.int;
    dash.getCell("C" + r).numFmt = H.FMT.rub0;
    dash.getCell("D" + r).numFmt = H.FMT.rub0;
    dash.getCell("E" + r).numFmt = H.FMT.rub0;
    dash.getCell("F" + r).numFmt = H.FMT.rub0;
  });
  H.body(dash, "A9:F16");
  H.dataBar(dash, "E10:E16", H.THEME.band);

  dash.getCell("A18").value = "Как читать таблицу";
  dash.getCell("A18").font = { name: "Calibri", size: 11, bold: true, color: { argb: H.THEME.ink } };
  const notes = [
    "Цены — диапазон реальных предложений б/у. Часть позиций скрывает цену в объявлении — «—» значит цена уточняется у разборки.",
    "Диапазоны сильно зависят от региона, состояния и пробега донора; для 1.6 (21129) типичен катализатор в коллекторе.",
  ];
  notes.forEach((n, i) => {
    const r = 19 + i;
    dash.getCell("A" + r).value = "• " + n;
    dash.getCell("A" + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.ink } };
  });
  H.widths(dash, [["A", 22], ["B", 12], ["C", 16], ["D", 16], ["E", 14], ["F", 12]]);

  H.titleBand(src, "A1:D1", "Источники и площадки поиска",
    "Цены собраны из публичных объявлений и каталогов 2026 г.; площадки, где проверялся каждый раздел.");
  ["Площадка", "Что искать", "Тип", "Примечание"].forEach((h, i) => (src.getCell(H.colName(i + 1) + "3").value = h));
  H.headerRow(src, "A3:D3");
  const sources = [
    ["Авито (avito.ru)", "Любые бу-запчасти Lada Vesta", "Доска объявлений", "Самый живой бу-рынок; часть цен скрыта в объявлениях"],
    ["Дром / База Дром (baza.drom.ru)", "Двигатель 21129, ЭУР, МКПП", "База объявлений", "Контрактные снятые узлы, вся Россия"],
    ["X-Baz (xbaz.ru)", "Генератор, по модели", "Агрегатор разборок", "Показывает конкретные суммы от разных разборок"],
    ["Festima (festima.ru)", "Рулевая колонка, ЭУР", "Агрегатор б/у", "Цены видны в карточке"],
    ["FarPost (farpost.ru)", "ЭУР, электроника", "Агрегатор б/у", "Региональные цены, часто ниже московских"],
    ["Drive2 (drive2.ru)", "Термостат, дроссель, цены запчастей", "Бортжурналы владельцев", "Отчёты с реальными ценами покупки"],
    ["bi-bi.ru / carbox63.ru", "Фонарь, ММС", "Магазины", "Ориентир по новым/оригинальным"],
  ];
  sources.forEach((s, i) => {
    const r = 4 + i;
    s.forEach((v, j) => {
      const cell = src.getCell(H.colName(j + 1) + r);
      cell.value = v;
      cell.alignment = { vertical: "middle", wrapText: j === 1 };
    });
  });
  H.body(src, "A3:D12");
  H.widths(src, [["A", 34], ["B", 44], ["C", 28], ["D", 44]]);

  await wb.xlsx.writeFile("buy-zapchasti-lada-vesta-2018.xlsx");
  console.log("wrote buy-zapchasti-lada-vesta-2018.xlsx");
})();