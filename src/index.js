const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const apiRouter = require('./api')
app.use(require('cors')({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', apiRouter)

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`listening on port ${port}`))

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
prisma.$connect()
    .then(() => {
        console.log('データベース接続OK')
        prisma.$disconnect()
    })
    .catch((e) => {
        console.log(`データベース接続失敗: ${e}`)
        process.exit(1)
    })