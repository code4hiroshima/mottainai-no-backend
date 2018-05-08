# これは何？

mottainai-no のバックエンド処理プログラムです。

Clound Function で動作しています。

# 使い方

## デプロイ

```
yarn deploy
```

## ローカル環境へのデプロイ

```
yarn deploy:local
```

# 事前準備

## デプロイの事前準備

* 依存パッケージのインストール
* ローカルエミュレータのインストール
* 認証情報の用意
* config.js の作成

### 依存パッケージのインストール

```
yarn install
```

### ローカルエミュレータのインストール

https://cloud.google.com/functions/docs/emulator

```
yarn global add @google-cloud/functions-emulator
```

### 認証情報の用意

GCP のコンソールの[認証情報](https://console.cloud.google.com/apis/credentials)で認証情報を作成し、作成した情報をダウンロードして`credentials.json`として保存します。

### config.js の準備

`config.js.sample`を`config.js`に保存し、読み取りをするスプレッドシートの ID を`spreadSheetKey`に設定します。
