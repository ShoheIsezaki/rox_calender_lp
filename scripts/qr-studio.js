#!/usr/bin/env node
// 使い方: npm i --no-save qrcode@1.5.4 && node scripts/qr-studio.js
// STUDIO（the-rox-69.com）上のカレンダー中継ページ用QRを qr/ に出力する
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const utm = 'utm_source=offline&utm_medium=qr&utm_campaign=liquidroom_oneman_2027';
const targets = {
  'calendar-google': `https://the-rox-69.com/go/calendar_liquid_270523_google?${utm}&utm_content=calendar_google`,
  'calendar-apple': `https://the-rox-69.com/go/calendar_liquid_270523_apple?${utm}&utm_content=calendar_apple`,
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
