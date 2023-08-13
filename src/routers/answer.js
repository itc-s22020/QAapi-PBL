const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth} = require('./user')

router.post('/new', Auth, async (req, res) => {
    const {q_id, a_text} = req.body
    const count = await prisma.answer.count({
        where: {
            user_id: req.user,
            q_id: q_id
        }
    })
    if (count > 0) {
        res.status(400).json({
            message: 'このユーザーはこの質問に回答済みです'
        })
    } else {
        await prisma.answer.create({
            data: {
                user_id: req.user,
                q_id: q_id,
                a_text: a_text
            }
        }).then((r) => {
            res.status(200).json({
                message: '回答投稿完了',
                a_id: r.a_id,
                a_text: r.a_text
            })
        }).catch(() => {
            res.status(400).json({
                message: '回答投稿失敗'
            })
        })
    }
})

module.exports = router