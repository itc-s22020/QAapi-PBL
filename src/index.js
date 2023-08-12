const express = require('express')
const app = express()
require('dotenv').config()
const apiRouter = require('./api')

app.use(express.json())
app.use('/api', apiRouter)

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`listening on port ${port}`))