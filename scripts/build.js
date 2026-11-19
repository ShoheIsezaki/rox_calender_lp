#!/usr/bin/env node
// 使い方: node scripts/build.js
//  - ics/liquidroom-20270523.ics を RFC 5545 準拠（CRLF・エスケープ・75オクテット折り返し）で生成
//  - liquidroom/google/index.html 内の予定データを scripts/event.js と同期
const fs = require('fs');
const path = require('path');
const ev = require('./event');

const root = path.join(__dirname, '..');

// RFC 5545 3.3.11 TEXT のエスケープ
function escapeText(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

// RFC 5545 3.1 行の折り返し（UTF-8の文字途中では切らない）
function fold(line) {
  const out = [];
  let cur = '';
  let curBytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = Buffer.byteLength(ch, 'utf8');
    if (curBytes + b > limit) {
      out.push(cur);
      cur = ' ';
      curBytes = 1;
      limit = 75;
    }
    cur += ch;
    curBytes += b;
  }
  out.push(cur);
  return out.join('\r\n');
}

// DTSTAMP は生成のたびに変わらないよう固定（内容変更時は SEQUENCE と一緒に更新）
const DTSTAMP = '20261108T000000Z';
const SEQUENCE = 0;

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//The R.O.X & GWO//Calendar Event//JA',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-TIMEZONE:Asia/Tokyo',
  'BEGIN:VTIMEZONE',
  'TZID:Asia/Tokyo',
  'BEGIN:STANDARD',
  'DTSTART:19700101T000000',
  'TZOFFSETFROM:+0900',
  'TZOFFSETTO:+0900',
  'TZNAME:JST',
  'END:STANDARD',
  'END:VTIMEZONE',
  'BEGIN:VEVENT',
  `UID:${ev.UID}`,
  `DTSTAMP:${DTSTAMP}`,
  `SEQUENCE:${SEQUENCE}`,
  `DTSTART;TZID=${ev.TZ}:${ev.START_LOCAL}`,
  `DTEND;TZID=${ev.TZ}:${ev.END_LOCAL}`,
  `SUMMARY:${escapeText(ev.ICS_SUMMARY)}`,
  `LOCATION:${escapeText(ev.LOCATION)}`,
  `DESCRIPTION:${escapeText(ev.DETAILS)}`,
  'STATUS:CONFIRMED',
  'TRANSP:OPAQUE',
  'END:VEVENT',
  'END:VCALENDAR',
];

const ics = lines.map(fold).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(root, 'ics', 'liquidroom-20270523.ics'), ics);

// Google用HTMLの予定データを同期
const htmlPath = path.join(root, 'liquidroom', 'google', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const data = {
  text: ev.GOOGLE_TITLE,
  dates: `${ev.START_UTC}/${ev.END_UTC}`,
  details: ev.DETAILS,
  location: ev.LOCATION,
  ctz: ev.TZ,
};
const re = /(\/\*EVENT_DATA\*\/)[\s\S]*?(\/\*END_EVENT_DATA\*\/)/;
if (!re.test(html)) throw new Error('EVENT_DATA marker not found in google/index.html');
const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
fs.writeFileSync(htmlPath, html.replace(re, `$1${json}$2`));


// ---- STUDIO 用カスタムコード ----
const gparams = new URLSearchParams();
gparams.set('action', 'TEMPLATE');
gparams.set('text', data.text);
gparams.set('dates', data.dates);
gparams.set('details', data.details);
gparams.set('location', data.location);
gparams.set('ctz', data.ctz);
const googleUrl = 'https://calendar.google.com/calendar/render?' + gparams.toString();

function studioSnippet({ eventName, destination, destinationLabel, calendarType }) {
  return `<script>
(() => {
  const measurementId = '${ev.GA4_ID}';
  const destination = '${destination}';
  let redirected = false;

  // LINEアプリ内ブラウザでは外部ブラウザで開き直す（UTMは維持）。
  // 計測は開き直した側で1回だけ行う。
  const params = new URLSearchParams(location.search);
  if (/\\bLine\\//i.test(navigator.userAgent) && params.get('openExternalBrowser') !== '1') {
    params.set('openExternalBrowser', '1');
    location.replace(location.pathname + '?' + params.toString());
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    dataLayer.push(arguments);
  };

  const redirect = () => {
    if (redirected) return;
    redirected = true;
    window.location.replace(destination);
  };

  // このページを新GA4で計測（UTMもこのpage_viewで記録される）
  gtag('config', measurementId);

  // GAが動作しない場合も最大5秒で転送
  const fallback = setTimeout(redirect, 5000);

  gtag('event', '${eventName}', {
    send_to: measurementId,
    calendar_type: '${calendarType}',
    live_id: '${ev.LIVE_ID}',
    destination: '${destinationLabel}',
    transport_type: 'beacon',
    event_callback: () => {
      clearTimeout(fallback);
      redirect();
    },
    event_timeout: 4000
  });
})();
</script>
`;
}

const studioDir = path.join(root, 'studio');
fs.mkdirSync(studioDir, { recursive: true });
fs.writeFileSync(path.join(studioDir, 'calendar_liquid_270523_google.html'), studioSnippet({
  eventName: 'calendar_add_liquidroom_20270523_google',
  destination: googleUrl,
  destinationLabel: 'google_calendar',
  calendarType: 'google',
}));
fs.writeFileSync(path.join(studioDir, 'calendar_liquid_270523_apple.html'), studioSnippet({
  eventName: 'calendar_add_liquidroom_20270523_apple',
  destination: ev.ICS_URL,
  destinationLabel: 'apple_calendar',
  calendarType: 'apple',
}));
fs.writeFileSync(path.join(studioDir, 'manual_links.txt'),
  '# 自動転送されない場合の手動リンク先（STUDIOのボタンのリンクに設定）\n\n' +
  '## Google\n' + googleUrl + '\n\n## Apple\n' + ev.ICS_URL + '\n');

console.log('generated ics, synced liquidroom/google/index.html, wrote studio/*');
