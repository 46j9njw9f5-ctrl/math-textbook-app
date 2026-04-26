# Math Textbook App

数学の概念・公式・式変形・解法理由を、問題演習よりも理解重視で学ぶためのローカル完結アプリです。

## できること

- 単元ごとの教科書ページを読む
- つまずき方を選んで説明の切り口を変える
- 式変形を1行ずつ追う
- 概念マップで単元内のつながりを見る
- ダークテーマで数式を読みやすく確認する

## 対応単元

- 数と式
- 二次関数
- 三角比
- 場合の数
- 確率
- 図形と計量
- 数列
- ベクトル
- 微分
- 積分

## ローカル起動

```bash
npm install
npm run dev
```

通常は `http://localhost:5173` で確認できます。

## 課金について

このアプリは外部AI APIを使わない完全ローカル版です。
追加課金なしで動きます。

## GitHub に載せる

1. GitHub で新しいリポジトリを作る
2. このフォルダをそのリポジトリに push する
3. GitHub Actions を有効にする
4. `Settings > Pages` で `GitHub Actions` を公開元にする

入っているもの:

- `.github/workflows/ci.yml`
  - push / pull request で lint と build を実行
- `.github/workflows/deploy-pages.yml`
  - main または master に push すると GitHub Pages へ配備
- `.github/ISSUE_TEMPLATE/lesson-feedback.yml`
  - 教材改善依頼を整理して受けるテンプレート
- `.github/pull_request_template.md`
  - 教材更新時の確認漏れを減らすテンプレート

## どこでも使う方法

### 1. GitHub Pages

静的サイトとして公開できます。いちばん手軽です。

### 2. Docker

```bash
docker build -t math-textbook-app .
docker run -p 8080:80 math-textbook-app
```

ブラウザで `http://localhost:8080` を開いてください。

### 3. 静的ホスティング

`dist` をそのまま配布できます。

```bash
npm run build
```

`dist/` を Netlify, Vercel, Cloudflare Pages, S3 などに配置できます。

## 開発コマンド

```bash
npm run dev
npm run build
npm run lint
```
