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
  ["Двигатель", "Головка блока цилиндров (ГБЦ)", "6AR-FSE", null, null, "parts.av.by: 1 объявление от 1566 BYN (~47 тыс.₽) — цена белорусская, РФ-цену перепроверять"],
  ["Двигатель", "Впускной коллектор", "2.5 2AR-FE", null, null, "Авито — объявление есть, цена не раскрыта, по запросу разборок"],
  ["Двигатель", "Выпускной коллектор", "1714174200", 8230, 8230, "izap24.ru — б/у (модель XV70 точно не подтверждена)"],
  ["Двигатель", "Форсунка омывателя фары", "85208-33150", 2800, 2800, "Авито — б/у; новый рестайлинг 7000 ₽ там же"],
  ["Двигатель", "Катушка зажигания", "90919-02256", null, null, "Авито — цена не раскрыта, по запросу разборок"],
  ["Двигатель", "Генератор", "XV70 2019", null, null, "idriver.by: 477 BYN (~14 тыс.₽) — белорусский эквивалент, РФ-цену перепроверять"],
  ["Двигатель", "Компрессор кондиционера", "4472500653", 30000, 30000, "zap-777.com — б/у"],
  ["Двигатель", "Радиатор охлаждения", "16400-25130", 33600, 33600, "Авито, Москва — для V70/Lexus ES"],
  ["Двигатель", "Трапеция дворников (стеклоочистителя)", "8515006211", 5000, 5000, "Авито, Монино — б/у"],

  ["Трансмиссия и привод", "АКПП контрактная", "U760E", null, null, "Авито (Ростов) — с гарантией, цена скрыта; капремонт U660E/U760E ~150 тыс.₽"],
  ["Трансмиссия и привод", "Привод колеса (полуось)", "434206B30", null, null, "Авито, Махачкала — есть, цена скрыта, по запросу"],

  ["Подвеска и рулевое", "Рычаг передний левый", "XV70 2.5", 43200, 43200, "zapchat.by — б/у"],
  ["Подвеска и рулевое", "Стойка стабилизатора", "48820-33090", 4988, 4988, "market.yandex — вероятно новый аналог, не б/у"],
  ["Подвеска и рулевое", "Стойка стабилизатора задняя", "48830-47010", null, null, "Авито — б/у за шт, цена скрыта"],
  ["Подвеска и рулевое", "Амортизатор передний (стойка)", "XV70 3.5", null, null, "Авито, Казань — б/у оригинал, цена скрыта"],
  ["Подвеска и рулевое", "Рулевая рейка", "44250-33620", null, null, "Авито — новая опция; б/у по запросу; аналог-новая от ~8642 ₽"],

  ["Тормоза", "Суппорт", "XV70", null, null, "parts.av.by: 51–435 BYN (~1,5–13 тыс.₽), цены белорусские"],
  ["Тормоза", "Суппорт задний правый", "47830-33280", null, null, "Авито — контракт, цена скрыта"],
  ["Тормоза", "Тормозные диски передние", "Advics A6F828B", 7900, 9900, "Авито — 7900 ₽ Advics и 9900 ₽ NIBK (новые/б/у не уточнено)"],

  ["Кузов и оптика", "Бампер передний (в сборе)", "5211906E50", 12000, 12000, "Авито — бампер в сборе с нижней решёткой 12 тыс.₽"],
  ["Кузов и оптика", "Фара Full LED (рестайлинг, 3 полосы)", "XV70/XV75", 37800, 37800, "Авито — комплект в сборе, б/у"],
  ["Кузов и оптика", "Фара левая LED (1 полоса)", "81185-33D70", null, null, "Авито — оригинал б/у, цена скрыта"],
  ["Кузов и оптика", "Лобовое стекло", "56101-06D40", 8000, 30000, "xbaz Нижний Новгород 8 тыс.₽; Авито оригинал б/у 30 тыс.₽"],
  ["Кузов и оптика", "Капот", "53301-33Q10", null, null, "Авито — б/у оригинал, цена «как на фото», скрыта"],
  ["Кузов и оптика", "Крыло переднее левое", "53802-06220", null, null, "Авито — б/у оригинал, цена скрыта"],
  ["Кузов и оптика", "Порог со стойкой (кузовной элемент)", "61304-33100", 39750, 39750, "toyota-komplekt.ru — кузовной элемент"],
  ["Кузов и оптика", "Решётка радиатора", "XV70 рест 2021–2023", null, null, "для V70 цена скрыта"],

  ["Электрика", "Блок управления стеклоподъёмниками", "V70/V75", 4500, 4500, "Авито — с памятью, б/у"],
  ["Электрика", "Моторчик стеклоподъёмника", "85710-33240", 2357, 5000, "izap24 2357 ₽; toyotadom 5000 ₽"],
  ["Электрика", "Стеклоподъёмник в сборе (левый передний)", "85720-33290", 12552, 12552, "izap24"],
  ["Электрика", "ECU / блок управления двигателем", "89661-0X710", null, null, "Авито, Краснодар — б/у оригинал, цена скрыта"],
  ["Электрика", "Воздуховоды панели приборов", "XV70", 3500, 3500, "Авито — оригинал, б/у"],

  ["Салон", "Передние сиденья (комплект)", "XV70", 100000, 100000, "Авито, Москва — б/у"],
  ["Салон", "Динамик двери передней левой", "XV70 2019", 15200, 15200, "zapchat.by — б/у"],
  ["Салон", "Подушка безопасности (водитель, в руль)", "XV70", null, null, "Авито — снята с нового авто, цена скрыта"],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  const dash = H.addSheet(wb, "Дашборд");
  const price = H.addSheet(wb, "Прайс");
  const src = H.addSheet(wb, "Источники");

  const firstData = 4;
  const lastData = firstData + ITEMS.length - 1;

  H.titleBand(price, "A1:K1", "БУ-запчасти Toyota Camry XV70 (2018 г., 2.5)",
    "Цены — реальные публичные предложения б/у (сентябрь 2026): Авито, izap24, zapchat, parts.av.by и разборки. «Лучшая цена» = минимальная из найденных; ссылки открывают поиск детали на Avito и Дроме.");
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
    const q = encodeURIComponent("toyota camry xv70 " + it[1] + " бу");
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

  H.titleBand(dash, "A1:F1", "Сводка по бу-запчастям Toyota Camry XV70 2018",
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
    "Цены — диапазон реальных предложений б/у. Часть позиций (Фар/оптика б/у, к/з) зачастую скрывают цену в объявлении — «—» значит цена уточняется у разборки.",
    "Диапазон сильно зависит от комплектации и года; для 2018 г. актуальны фары LED 1-полосные, для рестайлинга — Full LED.",
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
    ["Авито (avito.ru)", "Любые бу-запчасти Camry XV70", "Доска объявлений", "Главный бу-рынок РФ; часть цен скрыта в объявлениях"],
    ["Дром / База Drom (baza.drom.ru)", "Двигатель, кузов, АКПП", "База объявлений", "Контрактные снятые узлы, вся Россия"],
    ["iZAP24 (izap24.ru)", "Стеклоподъёмники, выпускной", "Контрактный агрегатор", "Цены видны в карточке"],
    ["zapchat.by", "Рычаг, динамик, ГБЦ", "Каталог разборок", "Белорусская площадка, цены часто в BYN"],
    ["parts.av.by", "Суппорт, ГБЦ по каталогу", "Контрактный агрегатор", "Цены в BYN"],
    ["toyota-komplekt.ru", "Порог, кузовные", "Разборка/комплектующие", "Цены в карточке"],
    ["zap-777.com", "Компрессор кондиционера", "Контрактный магазин", "Цены в карточке"],
    ["izap24 / idriver / zapchat", "Генератор, электрика", "Агрегаторы", "Компактная электрика и навесное"],
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

  await wb.xlsx.writeFile("buy-zapchasti-toyota-camry-2018.xlsx");
  console.log("wrote buy-zapchasti-toyota-camry-2018.xlsx");
})();