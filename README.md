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

1. このフォルダを GitHub に push する
2. `npm run build:docs` で `docs/` を生成する
3. `docs/.nojekyll` があることを確認する
4. `docs/` を commit して push する
5. GitHub の `Settings > Pages` で次を選ぶ
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`

この方式は GitHub Actions を使わないので、Actions の制限に引っかかりません。

## 公開更新を楽にする

```powershell
.\publish-docs.ps1
```

これで次をまとめて実行します。

- `npm run build:docs`
- `docs/.nojekyll` を作成
- `docs/` を commit
- `git push`

## どこでも使う方法

### 1. GitHub Pages

`main` ブランチの `docs/` をそのまま公開します。

### 2. Docker

```bash
docker build -t math-textbook-app .
docker run -p 8080:80 math-textbook-app
```

ブラウザで `http://localhost:8080` を開いてください。

### 3. 静的ホスティング

`dist` または `docs` をそのまま配布できます。

```bash
npm run build
```

または

```bash
npm run build:docs
```

## 開発コマンド

```bash
npm run dev
npm run build
npm run build:docs
npm run lint
```
