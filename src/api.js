const express = require('express')
const path = require("path");
const fs = require('fs')
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
// router.use("/icons", express.static(path.join("static", "icons")))
router.get('/icons/:user_id', (req, res, next) => {
    const extensions = ['png', 'jpg', 'jpeg']
    const uris = [
        ...extensions.map((ext) => path.join(__dirname, '..', 'static', 'icons', `${req.params.user_id}.${ext}`)),
        ...extensions.map((ext) => path.join(__dirname, '..', 'static', 'icons', 'default', `default.${ext}`))
    ]
    const file = uris.filter((uri) => fs.existsSync(uri))[0]
    res.sendFile(file)
})

// router.get('/icons/:filename', (req, res) => {
//     const filenameWithoutExtension = req.params.filename;
//     const validExtensions = ['.png', '.jpg', '.jpeg'];
//
//     // 対応する拡張子を優先的に探す
//     for (const extension of validExtensions) {
//         const filePath = path.join(__dirname, '..','static', 'icons', filenameWithoutExtension + extension);
//         console.log(filePath)
//         if (fs.existsSync(filePath)) {
//             res.sendFile(filePath);
//             return;
//         }
//     }
//     res.status(404).send('File not found');
// });

module.exports = router