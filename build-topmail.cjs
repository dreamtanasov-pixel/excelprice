const fs = require("fs");
const path = require("path");
const ROOT = "S:/MultiTool/HomeChats/Chat-8/";

const files = [
  "index.html",
  "kia-rio.html",
  "toyota-camry.html",
  "lada-vesta.html",
  "hyundai-solaris.html",
  "lada-granta.html",
  "kassa-success.html",
  "policy.html",
  "oferta.html",
];

const counter = `<!-- Top.Mail.Ru counter -->
<script type="text/javascript">
var _tmr = window._tmr || (window._tmr = []);
_tmr.push({id: "3797393", type: "pageView", start: (new Date()).getTime()});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "tmr-code");
</script>
<noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3797393;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div></noscript>
<!-- /Top.Mail.Ru counter -->
`;

for (const f of files) {
  const fp = ROOT + f;
  let s = fs.readFileSync(fp, "utf8").replace(/^\uFEFF/, "");
  if (s.includes("top-fwz1.mail.ru")) {
    console.log("already has counter (skip):", f);
    continue;
  }
  // вставляем перед </head> (после меты стилей)
  if (s.includes("</head>")) {
    s = s.replace("</head>", counter + "\n</head>");
  } else {
    console.log("NO </head> (skip):", f);
    continue;
  }
  fs.writeFileSync(fp, "\uFEFF" + s, "utf8");
  console.log("added counter:", f);
}
console.log("DONE");