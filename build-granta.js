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
  ["Двигатель", "Двигатель в сборе (контрактный 21126/21127)", "21126/21127", 43000, 70000, "XBaz: ВАЗ-11183 43 т₽, Калина 2192 70 т₽"],
  ["Двигатель", "ГБЦ (16 кл)", "11186100300740", 25500, 30000, "XBaz — головка блока в сборе"],
  ["Двигатель", "ГБЦ (8 кл)", "11180100301100", 12000, 12000, "XBaz — в сборе"],
  ["Двигатель", "Клапанная крышка", "21114100326000", 2500, 2500, "XBaz"],
  ["Двигатель", "Форсунка топливная (1 шт)", "0280158017", 590, 590, "XBaz — цена за шт"],
  ["Двигатель", "Дроссельная заслонка (16 кл)", "211271148010", 3000, 4700, "XBaz"],
  ["Двигатель", "Впускной коллектор (16 кл, Е-газ)", "211271008600", 9990, 9990, "XBaz"],
  ["Двигатель", "Термостат (корпус)", "21900130601000", 600, 900, "XBaz"],
  ["Двигатель", "Радиатор охлаждения", "8450110797", 4010, 4560, "XBaz"],
  ["Двигатель", "Генератор", "2170370101013", 2500, 13360, "XBaz 2,5 т₽; б/у Яндекс.Маркет 13 360 ₽"],
  ["Двигатель", "Стартер", "2112370801002", 1500, 3000, "XBaz"],
  ["Двигатель", "Компрессор кондиционера", "21900811101200", 5000, 5000, "XBaz — дефект муфты"],
  ["Двигатель", "Катализатор / катколлектор", "8450120265", 2500, 15000, "XBaz: пустой 2,5–3,5 т₽, отличный 15 т₽"],
  ["Двигатель", "Глушитель в сборе", "21900120001000", 3000, 3000, "XBaz; задний 1,6–2,4 т₽"],
  ["Двигатель", "Резонатор", "", 800, 800, "XBaz"],

  ["Трансмиссия и привод", "АКПП 4-ст (контрактная)", "Jatco JF414E", 37400, 37400, "Авито — под заказ"],
  ["Трансмиссия и привод", "МКПП (тросовая, под ABS)", "21810170001200", 43000, 43000, "XBaz"],
  ["Трансмиссия и привод", "МКПП (8 кл)", "600282244", 35000, 35000, "XBaz; др. вариант 16 т₽"],
  ["Трансмиссия и привод", "Комплект сцепления (Valeo)", "C0583539R", 800, 6500, "XBaz б/у 800₽; новый Авито 6500₽"],
  ["Трансмиссия и привод", "Привод / полуось", "11180221509200", 1000, 3060, "XBaz"],
  ["Трансмиссия и привод", "ШРУС внутренний", "21900221505600", 1500, 1500, "XBaz"],

  ["Подвеска и рулевое", "Рычаг подвески", "21900290402000", 590, 1500, "XBaz"],
  ["Подвеска и рулевое", "Амортизатор задний", "21900291540251", 1080, 3600, "XBaz"],
  ["Подвеска и рулевое", "Рулевая рейка", "21923400010", 1500, 9000, "XBaz: с люфтом 1,5 т₽, исправная до 9 т₽"],
  ["Подвеска и рулевое", "ЭУР", "8450111936", 25000, 30000, "XBaz"],
  ["Подвеска и рулевое", "Мотор ЭУР (Mando)", "45002300C1", 10000, 10000, "XBaz"],

  ["Тормоза", "Суппорт передний", "11180350101200", 1000, 1590, "XBaz"],
  ["Тормоза", "Диск тормозной передний", "2110350107002", 500, 2500, "XBaz"],

  ["Кузов и оптика", "Фара передняя", "8450111447", 1000, 9500, "XBaz: с дефектом 1–2,5 т₽, целая 5–8 т₽"],
  ["Кузов и оптика", "Фонарь задний", "8450001361", 1190, 3500, "XBaz"],
  ["Кузов и оптика", "Капот", "8450104269", 5000, 10000, "XBaz"],
  ["Кузов и оптика", "Крыло переднее", "8450104274", 3500, 3500, "XBaz; заднее до 11 т₽"],
  ["Кузов и оптика", "Бампер передний", "8450100957", 1399, 7000, "XBaz"],
  ["Кузов и оптика", "Дверь передняя левая", "11180610001500", 7490, 10000, "XBaz"],

  ["Электрика", "ЭБУ (блок управления ДВС)", "11186141102047", 10500, 10500, "XBaz"],
  ["Электрика", "Панель приборов", "", 6500, 12500, "Авито — пересвеченная"],
  ["Электрика", "Мотор печки", "21900811801000", 1000, 2100, "XBaz"],

  ["Салон", "Сиденье переднее", "21901681000800", 1500, 10000, "XBaz; комплект сидений 5–25 т₽"],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  const dash = H.addSheet(wb, "Дашборд");
  const price = H.addSheet(wb, "Прайс");
  const src = H.addSheet(wb, "Источники");

  const firstData = 4;
  const lastData = firstData + ITEMS.length - 1;

  H.titleBand(price, "A1:K1", "БУ-запчасти Lada Granta (седан, 1.6, 21126/21127)",
    "Цены — реальные публичные предложения б/у (сентябрь 2026). Источник: XBaz (агрегатор разборок, цены в карточках), Авито, Яндекс.Маркет.");
  const priceHeader = ["№", "Категория", "Деталь", "Артикул / ориентир", "Цена мин, руб", "Цена макс, руб", "Ср. цена, руб", "Примечание", "Лучшая цена, руб", "Avito", "Дром"];
  priceHeader.forEach((h, i) => (price.getCell(H.colName(i + 1) + "3").value = h));
  H.headerRow(price, "A3:K3");
  H.widths(price, [["A", 5], ["B", 22], ["C", 42], ["D", 18], ["E", 13], ["F", 13], ["G", 12], ["H", 46], ["I", 14], ["J", 24], ["K", 24]]);
  H.freeze(price, 3);

  ITEMS.forEach((it, i) => {
    const r = firstData + i;
    price.getCell("A" + r).value = i + 1;
    price.getCell("B" + r).value = it[0];
    price.getCell("C" + r).value = it[1];
    price.getCell("D" + r).value = it[2];
    const mn = it[3];
    const mx = it[4];
    const q = encodeURIComponent("lada granta " + it[1] + " бу");
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
      ["E", "F", "G", "I"].forEach(c => {
        price.getCell(c + r).value = "—";
        price.getCell(c + r).font = { name: "Calibri", size: 10, color: { argb: H.THEME.muted } };
      });
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

  H.titleBand(dash, "A1:F1", "Сводка по бу-запчастям Lada Granta",
    "Считается автоматически с листа «Прайс». Сентябрь 2026.");
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
    ["B", "C", "D", "E", "F"].forEach(c2 => dash.getCell(c2 + r).numFmt = (c2 === "B" ? H.FMT.int : H.FMT.rub0));
  });
  H.body(dash, "A9:F16");
  H.dataBar(dash, "E10:E16", H.THEME.band);

  dash.getCell("A18").value = "Как читать таблицу";
  dash.getCell("A18").font = { name: "Calibri", size: 11, bold: true, color: { argb: H.THEME.ink } };
  ["Цены — диапазон реальных предложений б/у по всей России; итог зависит от состояния и региона.",
   "«—» в колонке цены: публичная цена не подтверждена — уточняется у разборки.",
  ].forEach((n, i) => {
    dash.getCell("A" + (19 + i)).value = "• " + n;
    dash.getCell("A" + (19 + i)).font = { name: "Calibri", size: 10, color: { argb: H.THEME.ink } };
  });
  H.widths(dash, [["A", 22], ["B", 12], ["C", 16], ["D", 16], ["E", 14], ["F", 12]]);

  H.titleBand(src, "A1:D1", "Источники",
    "Цены из публичных каталогов и объявлений 2026 г.");
  ["Площадка", "Что искать", "Тип", "Примечание"].forEach((h, i) => (src.getCell(H.colName(i + 1) + "3").value = h));
  H.headerRow(src, "A3:D3");
  [
    ["XBaz (xbaz.ru)", "Любые бу-запчасти Granta", "Агрегатор разборок", "Цены видны в карточке без входа"],
    ["Авито", "Контрактные узлы, панель приборов", "Доска объявлений", "Часть цен скрыта в объявлениях"],
    ["Яндекс.Маркет (б/у)", "Генератор", "Агрегатор", "Бу-лоты"],
  ].forEach((s, i) => {
    const r = 4 + i;
    s.forEach((v, j) => { const c = src.getCell(H.colName(j + 1) + r); c.value = v; c.alignment = { vertical: "middle", wrapText: j === 1 }; });
  });
  H.body(src, "A3:D7");
  H.widths(src, [["A", 34], ["B", 44], ["C", 28], ["D", 44]]);

  await wb.xlsx.writeFile("buy-zapchasti-lada-granta-2016.xlsx");
  console.log("wrote buy-zapchasti-lada-granta-2016.xlsx");
})();