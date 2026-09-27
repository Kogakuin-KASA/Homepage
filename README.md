# 工学院大学 宇宙開発プロジェクト KASA 公式ウェブサイト

工学院大学の公認学生プロジェクト「宇宙開発プロジェクトKASA (Kogakuin AeroSpace Adventurers)」の公式ホームページです。

- **公開URL:** https://kogakuin-kasa.github.io/Homepage/
- **公開方法:** GitHub Pages（`main` ブランチの `/ (root)` をそのまま公開）
- **構成:** HTML / CSS / JavaScript のみ（ビルド不要）

> ⚠️ **このリポジトリは Public（誰でも閲覧可能）です。**
> 名簿・学籍番号・電話番号・Google フォームの回答・パスワードなどは絶対にコミットしないでください。

---

## 🔄 サイトを更新する手順

ファイルを編集したら、このフォルダで次の3行を実行します。1〜2分後に公開サイトへ反映されます。

```bash
git add -A
git commit -m "変更内容のメモ（例: お知らせを追加）"
git push
```

- 反映前に手元で確認したいときは `python -m http.server 8000` を実行し、ブラウザで `http://localhost:8000` を開きます。
- `git push` で権限エラー（403）が出た場合は、公式アカウント（Kogakuin-KASA）のリポジトリ **Settings → Collaborators** から自分の GitHub アカウントを招待してもらってください。

---

## 📁 ディレクトリ構成

```
.
├── index.html        # メインページ（全セクションを1ページに収録）
├── 404.html          # 存在しないURLを開いたときのページ
├── favicon.ico
├── css/
│   ├── style.css         # デザイン全般
│   └── responsive.css    # タブレット・スマホ向けの調整
├── js/
│   └── main.js           # メニュー開閉、現在地ハイライト、写真の拡大表示、
│                         # ニュースの絞り込み、note記事の自動取得、お問い合わせフォーム送信
└── assets/images/        # 写真・ロゴ
```

### 写真の使われている場所

| ファイル | 内容 | 使用箇所 |
|---|---|---|
| `kasa_logo.png` / `kasa_icon.png` | 公式ロゴ | ヘッダー、フッター、Xカード |
| `space_earth_moon_bg.jpg` | 地球と月の背景 | ヒーロー・フッター背景 |
| `izu_hybrid_launch.jpg` | 伊豆大島共同打上実験 | ヒーロー、2019年、SNSシェア画像 |
| `workshop_machining.jpg` | 夢づくり工房でのフライス盤加工 | About、note記事の代替サムネイル |
| `rocket_manufacture.jpg` | モデルロケット打上げ | About |
| `izu_hybrid_rocket.jpg` | エンジン設計ミーティング | About、推進班 |
| `c_rocket_assembly.jpg` | 旋盤での加工 | 構造班 |
| `avionics_activity.jpg` | マイコン・電子回路 | 電装班 |
| `hero_strikingly.jpg` | CanSatローバー | 衛星・CanSat班 |
| `rocket_body_2026.jpg` / `cansat_rover_2026.jpg` | 2026年度の機体・CanSat | タイムライン 2026年 |
| `hachioji_festival.jpg` / `hachioji_festival_stall.jpg` | 八王子祭の展示・模擬店 | タイムライン 2024〜2025年 |
| `kasa_model_rocket_launch.jpg` / `x_post_*.jpg` | Xポストの画像 | ニュース欄のXカード |
| `workshop_electronics.jpg` | 電子工作体験会 | （現在未使用） |

---

## ✏️ よくある編集

### お知らせを追加する
`index.html` の `<div class="news-grid" id="newsGrid">` 内にある `<article class="news-card ..." data-category="news">` を1つ複製し、日付・タイトル・本文・リンクを書き換えます。

### X のポストを載せる
同じく `newsGrid` 内の `<article class="news-card card-x ..." data-category="x">` を複製して書き換えます。書き換える場所は次のとおりです。

- 本文、ハッシュタグ、日付（`<time datetime="YYYY-MM-DD">`）
- ポストのURL（`https://x.com/KASA85501732/status/〜`、2か所）
- 画像（`assets/images/` に保存して `src` と `data-preview-img` を変更）
- 返信・リポスト・いいね・表示回数（手入力です。自動更新はされません）

### 写真を追加・差し替える
1. 写真を `assets/images/` に保存します。**スマホで撮った写真は位置情報（GPS）が入っていることがあるので、削除してから入れてください。**
2. `index.html` の該当する `<img>` の `src` を書き換えます。
3. クリックで拡大表示させたい場合は、`data-preview-img="画像パス"`、`data-title="タイトル"`、`data-desc="説明"` を付けます（キーボード操作にも自動で対応します）。
4. `alt` に写真の内容を書いてください（画像が表示できない人や読み上げソフト向け）。

### note（活動ブログ）
note に記事を投稿すると、「活動ブログ (note)」欄に最新3件が自動で表示されます（コードの編集は不要）。記事が0件のあいだは「準備中です」と表示されます。
アカウントIDや表示件数は `js/main.js` 先頭の `NOTE_CONFIG` で変更できます。

```javascript
const NOTE_CONFIG = {
  creatorId: 'kasa_kogakuin', // https://note.com/<ここ>
  maxCount: 3,                // 表示する記事数
  defaultThumbnail: './assets/images/workshop_machining.jpg' // サムネイルがない記事用
};
```

---

## 📮 お問い合わせフォーム

- 送信内容は [FormSubmit](https://formsubmit.co/) 経由で **`kogakuin.kasa@gmail.com`** に届きます（有効化済み）。
- 送信に失敗した場合は、入力内容を使ってメールアプリから直接送れるボタンが表示されます。
- 送信先アドレスを変える場合は、`index.html` の `<form action="...">` と `js/main.js` 内の `kogakuin.kasa@gmail.com`（複数箇所）をすべて書き換え、新しいアドレスで再度「Activate Form」メールの承認が必要です。

---

## ⚠️ 公開URLを変えるとき（リポジトリ名の変更・独自ドメインなど）

URLが `https://kogakuin-kasa.github.io/Homepage/` 前提になっている箇所があるため、次も合わせて書き換えてください。

| ファイル | 箇所 |
|---|---|
| `index.html` | `<meta property="og:image">` と `<meta property="og:url">`（SNSでシェアしたときの画像・URL） |
| `404.html` | `<base href="/Homepage/">`（リポジトリ名を `Kogakuin-KASA.github.io` にした場合は `/`） |
