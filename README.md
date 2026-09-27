# 工学院大学 宇宙開発プロジェクト KASA 公式ウェブサイト

工学院大学の公認学生プロジェクト「宇宙開発プロジェクトKASA (Kogakuin AeroSpace Adventurers)」の公式ホームページです。
白と青を基調とした清潔感のあるモダンなデザインで、学生の手によるロケット開発・小型人工衛星（CanSat）開発の熱量と信頼性を発信します。

---

## 📁 ディレクトリ構成

```
.
├── index.html              # メインページ（全セクションを含むSPA構成）
├── 404.html                # 404エラーページ
├── css/
│   ├── style.css           # メインデザインシステム・タイポグラフィ・レイアウト
│   └── responsive.css      # スマホ・タブレット向けレスポンシブスタイル
├── js/
│   └── main.js             # スムーズスクロール、スマホメニュー開閉、写真モーダル表示
├── assets/
│   ├── images/             # 実際の活動写真・ロゴ画像
│   │   ├── kasa_logo.png           # 公式ロゴ
│   │   ├── kasa_icon.png           # アイコン
│   │   ├── izu_hybrid_launch.jpg   # 伊豆大島打上げ実験
│   │   ├── izu_hybrid_rocket.jpg   # ハイブリッドロケット機体
│   │   ├── rocket_manufacture.jpg  # 夢づくり工房での製作風景
│   │   ├── c_rocket_assembly.jpg   # ロケット組み立て
│   │   ├── parachute_mechanism.jpg # パラシュート開傘機構試作
│   │   ├── avionics_activity.jpg   # 電装班活動
│   │   ├── thermal_test.jpg        # 耐熱試験
│   │   ├── workshop_electronics.jpg# 電子工作体験会
│   │   ├── soramatsuri_launch.jpg  # 空まつり打上げ
│   │   └── hachioji_festival.jpg   # 八王子祭展示
└── README.md               # 本ドキュメント
```

---

## 🚀 GitHub Pages への公開手順

本リポジトリはビルド工程（npm build等）が不要な Pure HTML/CSS/JS で構成されているため、GitHubにプッシュするだけで即座に公開できます。

### 1. リポジトリをGitHubにプッシュ
```bash
git init
git add .
git commit -m "feat: Initial commit for KASA official website"
git branch -M main
git remote add origin https://github.com/<ユーザー名または組織名>/<リポジトリ名>.git
git push -u origin main
```

### 2. GitHub Pagesの設定
1. GitHubのリポジトリページを開き、上部タブの **Settings** をクリック
2. 左メニューの **Pages**（または `Code and automation` 内の `Pages`）をクリック
3. **Build and deployment** の設定：
   - **Source**: `Deploy from a branch` を選択
   - **Branch**: `main`（または `master`）、フォルダは `/ (root)` を選択
4. **Save** をクリック
5. 数分後、上部に表示されるURL（例: `https://<organization>.github.io/<repo>/`）にアクセスすれば世界中から閲覧可能になります。

---

## ✏️ サイトの更新・カスタマイズ方法

### 1. 写真の追加・差し替え
- 新しい写真は `assets/images/` フォルダに保存します。
- `index.html` 内の該当する `<img>` タグの `src` を書き換えてください。
- 写真をクリックしたときのモーダル拡大表示に対応させるには、`data-preview-img="画像パス"`、`data-title="タイトル"`、`data-desc="説明"` を付与します。

### 2. お知らせ（News）の追加
- `index.html` の `<section id="news">` 内にある `<article class="news-card">` を複製して、日付・タイトル・本文・リンクを書き換えるだけで簡単に追加できます。

### 3. 公式 note（ブログ）との自動連携設定
本サイトは **note の RSS フィードを利用して、note に投稿した最新記事を自動的に取得・表示する機能** を備えています。

- **note のアカウントIDを変更・設定する場合：**
  [js/main.js](file:///c:/Users/shusu/Downloads/HP/HP/js/main.js) の先頭にある以下の設定を編集してください：
  ```javascript
  const NOTE_CONFIG = {
    creatorId: 'kasa_kogakuin', // あなたの note ID (https://note.com/<ここ>)
    maxCount: 3,              // 表示する記事数
    defaultThumbnail: './assets/images/workshop_machining.jpg'
  };
  ```
- note で記事を投稿するだけで、GitHubリポジトリのコードを編集しなくても、ホームページ側の「活動ブログ (note)」に最新記事（サムネイル、タイトル、公開日、概要、noteリンク）が自動反映されます。

### 4. 公式 X（旧Twitter）つぶやきプレビューの設定
本サイトは **美しく確実につぶやきを表示するリッチプレビューカード** を備えています。
各カード（Xロゴ、タイトル、ポストを見るリンク）をクリックすると、実際のXポスト（個別ステータスURL）へ直接ジャンプします。

- **公式Xアカウントの設定：**
  [js/main.js](file:///c:/Users/shusu/Downloads/HP/HP/js/main.js) の先頭にある `X_CONFIG` でアカウント情報を設定します：
  ```javascript
  const X_CONFIG = {
    username: 'KASA85501732', // Xのユーザー名 (@KASA85501732)
    displayName: '工学院大学 宇宙開発プロジェクト KASA',
    profileUrl: 'https://x.com/KASA85501732',
    avatar: './assets/images/kasa_icon.png'
  };
  ```
- **つぶやきプレビューカードの更新・追加：**
  `index.html` の `<div class="news-grid" id="newsGrid">` 内にある `<article class="news-card card-x" data-category="x">` を編集・複製することで、最新のつぶやき内容や写真、ハッシュタグを簡単に更新できます。
- 訪問者は「公式X (ポスト)」フィルターをクリックすることで、Xのポストのみを素早く絞り込み表示できます。

### 5. お問い合わせフォーム（kogakuin.kasa@gmail.com 連携）
ページ下部のお問い合わせフォームから送信された内容は、**`kogakuin.kasa@gmail.com`** に直接メールとして届きます。

- **送信エンジン**: FormSubmit（バックエンドサーバー不要・完全無料・スパム対策済み）
- **初回送信時のアクティベーション（重要）**:
  サイトから初めてお問い合わせが送信された際、Google Workspace / Gmail（`kogakuin.kasa@gmail.com`）宛てに FormSubmit から「**Activate Form**」という確認メールが届きます。
  メール内の承認ボタンを **1回クリック** するだけで設定が完了し、以降のすべてのお問い合わせが自動的に Gmail 受信トレイへ届くようになります。
- **フォールバック機能**:
  万一ユーザーのブラウザ制限やネットワーク不調で送信に失敗した場合は、入力内容を保持したまま「✉️ メールアプリで直接送信する」ボタンが表示され、ユーザーのメールソフト（GmailやOutlookなど）からワンクリックで送信できるよう工夫されています。


