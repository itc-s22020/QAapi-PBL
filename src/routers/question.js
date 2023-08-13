const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth} = require('./user')

router.post('/new', Auth, async (req, res) => {
    const {c_id, q_text, title} = req.body
    await prisma.question.create({
        data: {
            user_id: req.user,
            c_id: c_id,
            q_text: q_text,
            title: title
        }
    }).then((r) => {
        res.status(200).json({
            message: '質問投稿完了',
            q_id: r.q_id,
            title: r.title,
            q_text: r.q_text
        })
    }).catch(() => {
        res.status(503).json({
            message: '質問投稿失敗'
        })
    })
})

module.exports = router