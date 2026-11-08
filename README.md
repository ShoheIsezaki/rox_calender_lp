# The R.O.X＆GWO LIQUIDROOM 2027/05/23 カレンダー登録導線

| 用途 | パス |
|---|---|
| Google カレンダー（QR対象） | `/liquidroom/google/` |
| Apple カレンダー（QR対象） | `/liquidroom/apple/` |
| ICS 本体 | `/ics/liquidroom-20270523.ics` |

各ページは GTM（GTM-KHWWPP8W）を読み込み、`calendar_add`（`calendar_type` = google / apple、`live_id` = liquidroom_20270523）を dataLayer に送ったあと遷移します。
遷移は GTM の `eventCallback`（`eventTimeout: 1000`）で行い、GTM がブロックされた場合も 1.4 秒後に強制遷移します。LINE アプリ内ブラウザでは `?openExternalBrowser=1` を付けて外部ブラウザで開き直し、計測は開き直した側で 1 回だけ行います。

## Vercel へのデプロイ
1. Vercel で「Add New → Project」からこのリポジトリを Import
2. Framework Preset: **Other**、Build Command / Output Directory は空のまま（静的配信）
3. Deploy。割り当てられたドメインを確認

## 公演情報を変更する場合
`scripts/event.js` を編集して `node scripts/build.js` を実行すると、ICS と Google 用 HTML の予定データが再生成されます。
ICS の内容を変えたら `scripts/build.js` の `SEQUENCE` を 1 増やし `DTSTAMP` を更新してください。

## QR コード
`qr/` に生成済み（`https://rox-calender-lp.vercel.app` 前提）。実ドメインが異なる場合は再生成:

```bash
npm i --no-save qrcode@1.5.4 && node scripts/qr.js https://<実際のドメイン>
```

独自ドメイン（例: `cal.the-rox-69.com`）を後で Vercel に向けても、パス構成はそのまま使えます。
