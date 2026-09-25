const os = require("os");
const path = require("path");
const CFG = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
const SKILL = path.join(CFG, "gigatool", "skills", "xlsx");
const ExcelJS = require(path.join(SKILL, "vendor", "exceljs.bundle.cjs"));

const FILES = [
  "buy-zapchasti-hyundai-creta-2019.xlsx",
  "buy-zapchasti-hyundai-solaris-2015.xlsx",
  "buy-zapchasti-kia-rio-2019-v2.xlsx",
  "buy-zapchasti-lada-granta-2016.xlsx",
  "buy-zapchasti-lada-largus-2016.xlsx",
  "buy-zapchasti-lada-niva-2018.xlsx",
  "buy-zapchasti-lada-vesta-2018.xlsx",
  "buy-zapchasti-mercedes-e210-1996.xlsx",
  "buy-zapchasti-toyota-camry-2018.xlsx",
  "buy-zapchasti-toyota-corolla-2016.xlsx",
];

const ACCENT = "FF2F5597";
const BAND = "FF2A7F77";
const INK = "FF1F2A37";
const MUTED = "FF667085";

(async () => {
  for (const f of FILES) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(f);

    // убрать старую визитку, если вдруг есть
    const old = wb.getWorksheet("О прайсе");
    if (old) wb.removeWorksheet(old.id);

    const sh = wb.addWorksheet("О прайсе");

    // Заголовок
    sh.getCell("A1").value = "ExcelPrice — цены на любые запчасти";
    sh.getCell("A1").font = { name: "Calibri", size: 18, bold: true, color: { argb: ACCENT } };
    sh.getCell("A2").value = "Полные прайс-листы по моделям авто: все запчасти + актуальные цены со всего интернета";
    sh.getCell("A2").font = { name: "Calibri", size: 11, color: { argb: MUTED } };

    // Ссылка на сайт
    sh.getCell("A4").value = { text: "Заказать свой прайс: https://excelprice.ru", hyperlink: "https://excelprice.ru" };
    sh.getCell("A4").font = { name: "Calibri", size: 13, bold: true, color: { argb: BAND }, underline: true };

    // Контакты
    sh.getCell("A6").value = "Контакты:";
    sh.getCell("A6").font = { name: "Calibri", size: 11, bold: true, color: { argb: INK } };
    sh.getCell("A7").value = "Telegram: @Excelprice";
    sh.getCell("A7").value = { text: "Telegram: @Excelprice", hyperlink: "https://t.me/Excelprice" };
    sh.getCell("A7").font = { name: "Calibri", size: 11, color: { argb: INK } };
    sh.getCell("A8").value = { text: "WhatsApp: +7 (900) 000-44-69", hyperlink: "https://wa.me/79000004469" };
    sh.getCell("A8").font = { name: "Calibri", size: 11, color: { argb: INK } };
    sh.getCell("A9").value = { text: "Email: dot.akc@yandex.ru", hyperlink: "mailto:dot.akc@yandex.ru" };
    sh.getCell("A9").font = { name: "Calibri", size: 11, color: { argb: INK } };

    // Примечание
    sh.getCell("A11").value = "Если этот файл вам прислали — вы можете заказать такой же прайс на свою модель на сайте excelprice.ru";
    sh.getCell("A11").font = { name: "Calibri", size: 10, color: { argb: MUTED }, italic: true };

    sh.getColumn(1).width = 70;

    await wb.xlsx.writeFile(f);
    console.log("visitka: " + f);
  }
  console.log("DONE");
})();