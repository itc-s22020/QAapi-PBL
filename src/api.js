const express = require('express')
const path = require("path");
const router = express.Router()

const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const questionRouter = require("./routers/question");
const answerRouter = require("./routers/answer");

router.get('/', (req, res) => res.send('test'))

router.get('/sample', (req, res) => {
    res.json({message: 'test api'})
})

// "/api/user"
router.use('/user', userRouter)

// "/api/category"
router.use('/category', categoryRouter)

// "/api/question"
router.use('/question', questionRouter)

// "/api/answer"
router.use('/answer', answerRouter)

// "/api/icons" では/static/icons内のファイルを静的に返す（ユーザーのアイコン用）
router.use("/icons", express.static(path.join("static", "icons")))

module.exports = router