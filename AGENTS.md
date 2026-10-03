# KASA 公式ウェブサイト 運用ガイド（AIエージェント・編集担当者向け）

このリポジトリを編集する AI エージェントと広報担当者のためのガイドです。作業前に必ず全体を読んでください。

- **公開URL:** https://kogakuin-kasa.github.io/Homepage/
- **リポジトリ:** https://github.com/Kogakuin-KASA/Homepage （Public）
- **公開方法:** GitHub Pages（`main` ブランチの `/ (root)`）。`main` に push すると1〜2分で本番に反映される
- **構成:** HTML / CSS / JavaScript のみ。ビルド工程・パッケージ管理なし

## 守ること

1. **ユーザーへの返答は日本語で。** 編集担当者はエンジニアとは限らない。専門用語は短く補足する。
2. **個人情報・秘密情報をコミットしない。** リポジトリは Public。名簿、学籍番号、電話番号、Google フォームの回答、パスワード、APIキーは置かない。
3. **写真の位置情報（EXIF GPS）を消してから追加する。** 追加前に確認し、入っていれば除去する。
4. **お問い合わせフォームを実際に送信しない。** 送信すると部の本物の受信箱（`kogakuin.kasa@gmail.com`）にメールが届く。動作確認では `formsubmit.co` へのリクエストをモック・遮断する。
5. **本番へ push する前にユーザーの確認を取る。** push するとすぐに一般公開される。
6. **写真の説明は写っている内容と一致させる。** ファイル名と中身が一致しないものがある（下の表を参照）。説明を書く前に画像を実際に見る。

## X（旧Twitter）の定期確認

| 項目 | 値 |
|---|---|
| 最終確認日 | 2026-09-27 |
| サイトに載っている最新ポスト | 2026-09-26（`status/2103755133532438905`） |
| 載せないと判断したポスト | 2026-09-27 HP公開のお知らせ（`status/2104167335296987589`、サイト自身の告知のため）<br>2026-09-17 天気のつぶやき（`status/2100370460559261808`、活動と関係が薄いため） |

**AIエージェントは作業を始める前に、今日の日付と「最終確認日」を比べる。7日以上空いていたら、依頼された作業に入る前にユーザーへ「X の確認から始めてよいか」を聞き、了承されたら次の手順で更新する。**

1. https://x.com/KASA85501732 を開き、「最新ポスト」より新しいポストを探す。
   - 実際のブラウザで開くと、ログインしていなくても最新の数件と数値（リポスト・いいね・表示回数）が読める。ブラウザを操作できるツールがあれば使う。
   - サーバーからページを直接取得する方法（HTTP で取ってくるだけのツール）は、X に拒否されることが多い。
   - プロフィールに出ないポストは、ポストのURL（`/status/<ID>`）を直接開けば読める。
   - 本文は X に表示されているとおりに写す。絵文字や言葉を足さない。
   - 日付は日本時間で書く。
   - ポストを読めないときは、ユーザーにポストのURL・本文・画像・数値を貼ってもらう。
2. 新しいポストがあれば、「X のポストを載せる」の手順でニュース欄に追加する。
   - Xカードは**直近3件**だけを新しい順に載せる。固定ポストは載せない。
   - 3件からはみ出したカードは削除し、そのカードの画像ファイルも `assets/images/` から削除する（リポジトリが膨らむのを防ぐため）。削除前に、ほかの場所で使われていないか検索して確かめる。
   - 画像は `x_post_YYYYMMDD.jpg`（投稿日）で保存し、長辺1200px程度に縮める。位置情報も消す。
3. リポスト・返信だけのものや、部の活動と関係の薄いものは載せない（数に入れない）。迷ったらユーザーに聞く。載せないと決めたポストは上の表に書く。
4. 載っているカードの数値も、今の値に更新する。
5. 新しいポストがなくても「最終確認日」を今日の日付に更新する。追加したら「最新ポスト」も更新する。
6. 変更後の確認チェックリストを行い、push 前にユーザーの確認を取る（「守ること」5）。

## 更新の流れ

```bash
python -m http.server 8000     # 手元で確認 → http://localhost:8000
git add -A
git commit -m "変更内容（日本語でよい）"
git push
```

- `git push` で 403 が出たら、その人の GitHub アカウントがコラボレーターになっていない。公式アカウント（Kogakuin-KASA）でリポジトリの **Settings → Collaborators** から招待し、本人が承認する。
- ポート 8000 が他のプロセスに使われていると、古い版が表示されることがある。表示内容がファイルと違うときは別のポートで起動する。

## 変更後の確認チェックリスト

- [ ] 画面幅 **375px（スマホ）/ 820px（タブレット）/ 1440px（PC）** で表示を確認する
- [ ] 横スクロールが発生していない（`document.documentElement.scrollWidth === clientWidth`）
- [ ] 画像のリンク切れがない
- [ ] コンソールにエラーが出ていない
- [ ] ナビのリンクで各セクションへ移動し、現在地のハイライトが追従する
- [ ] ニュースの絞り込み（すべて / お知らせ / note / X）が正しく動く
- [ ] 追加した写真がクリックと Enter キーで拡大表示でき、Esc で閉じる

## ファイル構成

```
index.html          メインページ（全セクションを1ページに収録）
404.html            存在しないURL用のページ（<base href="/Homepage/"> あり）
css/style.css       デザイン全般（色などは :root の CSS 変数）
css/responsive.css  〜1260px / 〜1024px / 〜768px / 〜480px の調整
js/main.js          メニュー、現在地ハイライト、写真の拡大表示、ニュースの絞り込み、
                    note 記事の自動取得、お問い合わせフォーム送信
assets/images/      写真・ロゴ
```

## よくある編集

### お知らせを追加する
`index.html` の `<div class="news-grid" id="newsGrid">` 内にある `<article class="news-card ..." data-category="news">` を複製し、日付（`<time datetime="YYYY-MM-DD">` と表示テキスト）、タイトル、本文、リンクを書き換える。新しいものを上に置く。

### X のポストを載せる
同じく `newsGrid` 内の `<article class="news-card card-x ..." data-category="x">` を複製して書き換える。

- 本文、ハッシュタグ、日付
- ポストのURL `https://x.com/KASA85501732/status/<ID>`（ロゴとリンクの2か所）
- 画像（`assets/images/x_post_YYYYMMDD.jpg` などで保存し、`src` と `data-preview-img` を変更）
- 返信・リポスト・いいね・表示回数は手入力（自動更新されない）

### 写真を追加・差し替える
1. `assets/images/` に保存する（位置情報を除去すること）。
2. `<img>` の `src` と `alt`（写っている内容の説明）を設定する。
3. クリックで拡大表示させるなら `data-preview-img="画像パス" data-title="タイトル" data-desc="説明"` を付ける。キーボード操作（tabindex・Enter）は main.js が自動で付与する。

### note（活動ブログ）
note の RSS を rss2json 経由で取得し、最新3件を自動表示する。記事が0件のあいだ、note の絞り込みでは「準備中です」と表示される。設定は `js/main.js` 先頭の `NOTE_CONFIG`。

## 写真の中身（ファイル名と中身が一致しないものに注意）

| ファイル | 実際に写っているもの | 使用箇所 |
|---|---|---|
| `kasa_logo.png` / `kasa_icon.png` | 公式ロゴ | ヘッダー、フッター、Xカード |
| `favicon.ico` / `favicon-*.png` / `apple-touch-icon.png` | 公式ロゴ（白背景・48倍数正方形） | favicon（Google検索・ブラウザ用） |
| `favicon.jpg`（ルート直下） | 公式ロゴ（白背景・正方形） | 旧favicon（互換用） |
| `space_earth_moon_bg.jpg` | 地球と月面 | ヒーロー・フッターの背景（CSS） |
| `izu_hybrid_launch.jpg` | 伊豆大島の打上げ準備（ランチャー） | ヒーロー、2019年、SNSシェア画像 |
| `workshop_machining.jpg` | フライス盤での加工 | About、note記事の代替サムネイル |
| `rocket_manufacture.jpg` | ⚠️ モデルロケットの打上げ（製作風景ではない） | About |
| `izu_hybrid_rocket.jpg` | ⚠️ ホワイトボードでのエンジン設計の議論（機体ではない） | About、推進班 |
| `c_rocket_assembly.jpg` | 旋盤での加工 | 構造班 |
| `avionics_activity.jpg` | マイコン・電子回路 | 電装班 |
| `hero_strikingly.jpg` | CanSat ローバー | 衛星・CanSat班 |
| `rocket_body_2026.jpg` / `cansat_rover_2026.jpg` | 2026年度の機体成形・CanSat | タイムライン 2026年 |
| `hachioji_festival.jpg` / `hachioji_festival_stall.jpg` | 八王子祭の展示・模擬店 | タイムライン 2024〜2025年 |
| `x_post_YYYYMMDD.jpg` | 各Xポストの画像 | ニュース欄のXカード |
| `workshop_electronics.jpg` | 電子工作体験会 | 未使用 |

## 実装上の注意

- **横方向のアニメーション:** `.fade-left` / `.fade-right` は `translateX(30px)` で登場する。画面幅 1260px 以下では横にはみ出すため、`responsive.css` で縦方向の動きに置き換えている。横方向に動く要素を追加するときは、スマホ幅でのはみ出しを確認する。
- **現在地ハイライト:** セクションの高さに依存しないよう、スクロール位置で判定している（`main.js`）。IntersectionObserver のしきい値方式に戻すと、スマホで縦長のセクションが判定されなくなる。
- **グリッドの子要素:** 長いメールアドレスなどでグリッドの列が広がらないよう、`min-width: 0` を付けている。
- **お問い合わせフォーム:** FormSubmit（`https://formsubmit.co/ajax/kogakuin.kasa@gmail.com`）に送信する（有効化済み）。送信先を変えるときは `index.html` の `<form action>` と `main.js` 内の複数箇所を書き換え、新しいアドレスで「Activate Form」メールの承認が必要。送信に失敗したときは mailto のボタンに切り替わる。
- **公開URLに依存する箇所:** リポジトリ名の変更や独自ドメインへの移行でURLが変わったら、次も直す。
  - `index.html` の `<meta property="og:image">` と `<meta property="og:url">`（絶対URL）
  - `index.html` の構造化データ（JSON-LD）の `"url"`（WebSite / Organization）
  - `404.html` の `<base href="/Homepage/">`（ユーザーサイト `Kogakuin-KASA.github.io` にした場合は `/`）
