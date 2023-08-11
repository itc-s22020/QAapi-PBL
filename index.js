const express = require('express')
const app = express()
const path = require("path");
require('dotenv').config()
const apiRouter = require('./api')

app.use(express.json())
app.use('/api', apiRouter)

// "/api/icons" では/static/icons内のファイルを静的に返す（ユーザーのアイコン用）
app.use("/api/icons", express.static(path.join("static", "icons")))

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`listening on port ${port}`))