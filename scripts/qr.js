#!/usr/bin/env node
// 使い方: npm i --no-save qrcode@1.5.4 && node scripts/qr.js https://<vercel-domain>
// qr/ に Google / Apple 用の SVG と PNG を出力する
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\//.test(base)) { console.error('usage: node scripts/qr.js https://<domain>'); process.exit(1); }
const out = path.join(__dirname, '..', 'qr');
fs.mkdirSync(out, { recursive: true });
const opts = { errorCorrectionLevel: 'M', margin: 4 };
(async () => {
  for (const kind of ['google', 'apple']) {
    const url = `${base}/liquidroom/${kind}/`;
    fs.writeFileSync(path.join(out, `liquidroom-${kind}.svg`), await QRCode.toString(url, { ...opts, type: 'svg' }));
    await QRCode.toFile(path.join(out, `liquidroom-${kind}.png`), url, { ...opts, width: 1200 });
    console.log(kind, url);
  }
})();
