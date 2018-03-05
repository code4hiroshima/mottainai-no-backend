# これは何？

mottainai-no のバックエンド処理プログラムです。

Clound Function で動作しています。

# 使い方

## ローカル環境へのデプロイ

```
yarn deploy:local
```

### 事前準備

* 依存パッケージのインストール
* ローカルエミュレータのインストール
* 認証情報の用意

#### 依存パッケージのインストール

```
yarn install
```

#### ローカルエミュレータのインストール

https://cloud.google.com/functions/docs/emulator

```
yarn global add @google-cloud/functions-emulator
```

#### 認証情報の用意

GCP のコンソールの[認証情報](https://console.cloud.google.com/apis/credentials)で認証情報を作成し、作成した情報をダウンロードして`credentials.json`として保存します。
