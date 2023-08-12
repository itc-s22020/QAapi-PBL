const express = require('express')
const path = require("path");
const router = express.Router()

const userRouter = require("./routers/user").router;
const categoryRouter = require("./routers/category");

router.get('/', (req, res) => res.send('test'))

router.get('/sample', (req, res) => {
    res.json({message: 'test api'})
})

// "/api/user"
router.use('/user', userRouter)

// "/api/category"
router.use('/category', categoryRouter)

// "/api/icons" では/static/icons内のファイルを静的に返す（ユーザーのアイコン用）
router.use("/icons", express.static(path.join("static", "icons")))

module.exports = router