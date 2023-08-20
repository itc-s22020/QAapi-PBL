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
## POSTメソッドでのJSONデータの送信のやり方
ログインリクエストを送る例です。
### Fetch APIを使用する場合
```js
const data = {
    user_id: 'yamato1987',
    password: 'pass'
}
fetch(`${API_HOST}/api/user/login`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
})
    .then((r) => r.json())
    .then((d) => console.log(`ログイン成功 ${d}`))
```
### Axiosを使用する場合
```js
const data = {
    user_id: 'yamato1987',
    password: 'pass'
}
axios.post(`${API_HOST}/api/user/login`, data, {withCredentials: true})
    .then((r) => r.data)
    .then((d) => console.log(`ログイン成功 ${d}`))
```
# エンドポイント一覧
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
## GET `/api/user/logout` ![](https://img.shields.io/badge/USER-green)
ログアウトします。

具体的には、クッキーからアクセストークンを削除します。
## GET `/api/user/check` ![](https://img.shields.io/badge/USER-green)
ログインしていればステータスコード200を返します。

そうでなければステータスコード403を返します。
## GET `/api/user/checkadmin` ![](https://img.shields.io/badge/ADMIN-red)
管理者権限があればステータスコード200を返します。

そうでなければステータスコード403を返します。
## GET `/api/user/info/:user_id`
ユーザーの情報を返します。
### レスポンス例
```json
{
  "user_id": "admin",
  "name": "Administrator",
  "age": 20,
  "gender": 0,
  "like": 0,
  "admin": true
}
```
## GET `/api/question`
質問一覧を返します。 回答は**ベストアンサーのみ**返します。

質問は日付が新しい順でソートされます。

次のクエリパラメータが使用できます。

| パラメータ   | 説明                            |
|---------|-------------------------------|
| query   | 検索キーワード<br/>複数指定する場合はスペースで区切る |
| user_id | 投稿者のユーザーID                    |
| c_id    | カテゴリ                          |

### リクエスト例
カテゴリID`10`番の中で「クレヨンしんちゃん」か「映画」を含む質問を返します。
```
/api/question?query=クレヨンしんちゃん+映画&c_id=10
```
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
## POST `/api/question/delete` ![](https://img.shields.io/badge/USER-green)
質問を削除します。この質問に対する**回答も全て削除**します。
### リクエスト例
```json
{
  "id": 1
}
```
## GET `/api/question/:q_id`
`q_id`に該当する質問を返します。 回答は**全ての回答**を返します。

回答は日付が古い順、いいねが多い順でソートされます。
## POST `/api/question/best` ![](https://img.shields.io/badge/USER-green)
質問のベストアンサーを設定します。質問の投稿者のみ設定できます。
### リクエスト例
```json
{
  "q_id": 1,
  "a_id": 3
}
```
## POST `/api/question/like` ![](https://img.shields.io/badge/USER-green)
質問にいいねします。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/question/unlike` ![](https://img.shields.io/badge/USER-green)
質問へのいいねを解除します。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/question/liked` ![](https://img.shields.io/badge/USER-green)
質問へいいねしているかどうかを返します。
### リクエスト例
```json
{
  "id": 1
}
```
### レスポンス例
```json
{
  "liked": true
}
```
## POST `/api/answer/new` ![](https://img.shields.io/badge/USER-green)
回答を投稿します。
### リクエスト例
```json
{
  "q_id": 1,
  "a_text": "タージマハルは必見です！日の出や日没の時間帯に訪れると美しい景色を楽しめます。"
}
```
## POST `/api/answer/delete` ![](https://img.shields.io/badge/USER-green)
回答を削除します。投稿した本人か、その質問の投稿者のみ削除できます。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/answer/like` ![](https://img.shields.io/badge/USER-green)
回答にいいねします。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/answer/unlike` ![](https://img.shields.io/badge/USER-green)
回答へのいいねを解除します。
### リクエスト例
```json
{
  "id": 1
}
```
## POST `/api/answer/liked` ![](https://img.shields.io/badge/USER-green)
回答へいいねしているかどうかを返します。
### リクエスト例
```json
{
  "id": 1
}
```
### レスポンス例
```json
{
  "liked": true
}
```
## GET `/api/icons/:user_id`
ユーザーアイコンを返します。