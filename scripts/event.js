// 公演情報の唯一の定義元。ICS生成スクリプトとテストが参照する。
// Google用HTMLにも同じ内容を埋め込んでいるため、変更時は liquidroom/google/index.html も合わせて更新すること
// （scripts/build.js を実行すると HTML 内の DETAILS も自動で同期される）。

const LIVE_ID = 'liquidroom_20270523';

const DETAILS = [
  'The R.O.X＆GWO ONE-MAN LIVE',
  '「ロックス！夢をみせてくれ！」',
  '',
  '●日時',
  '2027年5月23日（日）',
  'OPEN 16:00',
  'START 17:00',
  '',
  '●Ticket',
  'スタンディング ¥4,000（税込）',
  '※ドリンク代別',
  '',
  '●出演',
  'The R.O.X＆GWO',
  'O.A. The Folie Phantom',
  '',
  '●会場',
  'LIQUIDROOM',
  '東京都渋谷区東3-16-6',
  '',
  '●チケット',
  '・e＋',
  'https://eplus.jp/sf/detail/4536630001-P0030002P021001?P1=1221',
  '',
  '・ローソンチケット',
  'https://l-tike.com/order/?gLcode=74359',
  'Lコード：74359',
  '',
  '・チケットぴあ',
  'https://t.pia.jp/pia/ticketInformation.do?eventCd=2634319&rlsCd=001&lotRlsCd=',
  '',
  '※未就学児入場不可',
].join('\n');

module.exports = {
  LIVE_ID,
  UID: 'liquidroom_20270523@the-rox-69.com',
  GOOGLE_TITLE: 'The R.O.X＆GWO ONE-MAN LIVE「ロックス！夢をみせてくれ！」LIQUIDROOM 17:00 Start',
  ICS_SUMMARY: 'The R.O.X＆GWO ONE-MAN LIVE「ロックス！夢をみせてくれ！」',
  LOCATION: 'LIQUIDROOM, 東京都渋谷区東3-16-6',
  // JST 16:00-20:00（終了時刻は未発表のため便宜上20:00）
  START_LOCAL: '20270523T160000',
  END_LOCAL: '20270523T200000',
  START_UTC: '20270523T070000Z',
  END_UTC: '20270523T110000Z',
  TZ: 'Asia/Tokyo',
  DETAILS,
};
