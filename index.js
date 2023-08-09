const express = require('express')
const app = express()
const path = require("path");
require('dotenv').config()
const session = require('express-session')
const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}

const apiRouter = require('./api')

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionConfig.cookie.secure = true
}
app.use(session(sessionConfig))

app.use(express.json())
app.use('/api', apiRouter)

// "/api/icons" では/static/icons内のファイルを静的に返す（ユーザーのアイコン用）
app.use("/api/icons", express.static(path.join("static", "icons")))

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`listening on port ${port}`))