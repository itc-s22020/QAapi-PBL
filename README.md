# QAapi-PBL
[QAapp-PBL](https://github.com/itc-s22020/QAapp-PBL)で使うためのAPIサーバーのプログラムです。
# クローンからAPIサーバー起動まで
## Step 1: リポジトリをクローン
下記のコマンドを実行してください。
```
# リポジトリをクローンする
git clone https://github.com/itc-s22020/QAapi-PBL.git
# ディレクトリに移動
cd QAapi-PBL
```
IntelliJ IDEAとかWebstormを使う場合は、プロジェクトを選ぶ画面の右上にある「VCSから取得」みたいなボタンからクローンすればOKです。
## Step 2: 依存関係のインストール
下記のコマンドを実行してください。
```
npm i
```
## Step 3: 設定ファイルを記述
`package.json`があるディレクトリに`.env`ファイルを作成してください。

作成したら下記の内容を貼り付け、環境に合わせて書き換えてください。
```
DATABASE_URL="postgresql://postgres:pass@localhost:5432/postgres?schema=public"
SECRET="推測されないランダムな文字列"
```
## Step 4: DBサーバー環境構築
下記のコマンドを実行してください。
```
# dockerディレクトリに移動
cd docker
# コンテナを起動する
docker compose up -d
```
`docker/docker-compose.yml`の設定は次のようになっています。

| 項目     | 内容           |
|--------|--------------|
| データベース | `PostgreSQL` |
| ユーザー名  | `postgres`   |
| パスワード  | `pass`       |
| ポート    | `5432`       |
## Step 5: データベースのマイグレーション
`prisma/schema.prisma`に書いてあるデータベースの設定をDBサーバーに反映させて、`prisma/seed.js`を実行して初期データを作成します。

下記のコマンドを実行してください。
```
npx prisma migrate dev
```
実行後に何か出ますが、何も入れずにEnterでOKです。
# APIの仕様
次のマークがあるものは認証（アクセストークン）が必要です

![](https://img.shields.io/badge/USER-green) ログインが必要

![](https://img.shields.io/badge/ADMIN-red) 管理者権限が必要

## 認証のやり方
`/api/user/login`にログインリクエストを送ると、アクセストークンがクッキーに保管されます。

クッキーを送信する設定でリクエストを送ると認証できます。
### Fetch APIを使用する場合
```js
fetch(`${API_HOST}/api/user/check`, {credentials: 'include'})
    .then((r) => r.json())
    .then((d) => {
        console.log(`${d.user}としてログインしています`)
    })
```
### Axiosを使用する場合
```js
axios.get(`${API_HOST}/api/user/check`, {withCredentials: true})
    .then((r) => r.data)
    .then((d) => {
        console.log(`${d.user}としてログインしています`)
    })
```
## GET `/api/category`
カテゴリ一覧を返します。
## POST `/api/category/register` ![](https://img.shields.io/badge/ADMIN-red)
カテゴリを新規登録します。
### リクエスト例
```json
{
  "name": "料理"
}
```
## POST `/api/category/delete` ![](https://img.shields.io/badge/ADMIN-red)
カテゴリを削除します。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/category/edit` ![](https://img.shields.io/badge/ADMIN-red)
カテゴリ名を編集します。
### リクエスト例
```json
{
  "id": 1,
  "name": "勉強"
}
```
## POST `/api/user/register`
ユーザーを登録します。
### リクエスト例
```json
{
  "user_id": "yamato1987",
  "password": "pass",
  "name": "山田 大和",
  "age": 34,
  "mail": "yamato1987@example.com",
  "gender": 0
}
```
## POST `/api/user/login`
ユーザーIDとパスワードを入れて、正しければ認証に必要なトークンを発行します。
### リクエスト例
```json
{
  "user_id": "yamato1987",
  "password": "pass"
}
```
## GET `/api/user/check` ![](https://img.shields.io/badge/USER-green)
ログインしていればステータスコード200を返します。

そうでなければステータスコード403を返します。
## GET `/api/user/checkadmin` ![](https://img.shields.io/badge/ADMIN-red)
管理者権限があればステータスコード200を返します。

そうでなければステータスコード403を返します。
## GET `/api/question`
質問一覧を返します。

回答はベストアンサーのみ返します。
## POST `/api/question/new` ![](https://img.shields.io/badge/USER-green)
質問を投稿します。
### リクエスト例
```json
{
  "c_id": 11,
  "title": "インド旅行について教えてください！",
  "q_text": "インドに行くのが初めてなので、観光スポットやおすすめの場所、注意すべきことなど、インド旅行に関するアドバイスを教えていただきたいです。"
}
```
## POST `/api/question/delete` ![](https://img.shields.io/badge/ADMIN-red)
質問を削除します。

この質問に対する回答も全て削除します。
### リクエスト例
```json
{
  "id": 1
}
```
## GET `/api/question/:q_id`
`q_id`に該当する質問を返します。

回答は全ての回答を返します。
## POST `/api/answer/new` ![](https://img.shields.io/badge/USER-green)
回答を投稿します。
### リクエスト例
```json
{
  "q_id": 1,
  "a_text": "タージマハルは必見です！日の出や日没の時間帯に訪れると美しい景色を楽しめます。"
}
```
## POST `/api/answer/delete` ![](https://img.shields.io/badge/ADMIN-red)
回答を削除します。
### リクエスト例
```json
{
  "id": 1
}
```