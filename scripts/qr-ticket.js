#!/usr/bin/env node
// 使い方: npm i --no-save qrcode@1.5.4 && node scripts/qr-ticket.js
// RED HOT チケット中継ページ（/go/lp_liquid_270523）のポスター用・名刺用QRを qr/ に出力する
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const base = 'https://the-rox-69.com/go/lp_liquid_270523?utm_source=offline&utm_medium=qr&utm_campaign=liquidroom_oneman_2027';
const targets = {
  'ticket-poster': `${base}&utm_content=poster`,
  'ticket-businesscard': `${base}&utm_content=businesscard_ticket`,
};
const out = path.join(__dirname, '..', 'qr');
const opts = { errorCorrectionLevel: 'M', margin: 4 };
(async () => {
  for (const [name, url] of Object.entries(targets)) {
    fs.writeFileSync(path.join(out, `${name}.svg`), await QRCode.toString(url, { ...opts, type: 'svg' }));
    await QRCode.toFile(path.join(out, `${name}.png`), url, { ...opts, width: 1200 });
    console.log(name, url);
  }
})();
