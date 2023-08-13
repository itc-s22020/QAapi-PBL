const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth} = require('./user')

router.get('', async (req, res) => {
    await prisma.question.findMany({
        include: {
            user: true,
            category: true,
            answers: true,
            best_a: true,
        }
    }).then((r) => {
        res.json(r.map((q) => ({
            q_id: q.q_id,
            user_id: q.user_id,
            user_name: q.user.name,
            title: q.title,
            q_text: q.q_text,
            date: q.date,
            like: q.like,
            view: q.view,
            c_id: q.c_id,
            c_name: q.category.c_name,
            best_a_id: q.best_a_id,
            best_a: q.best_a,
            answers: q.answers.map(a => ({
                a_id: a.a_id,
                user_id: a.user_id,
                user_name: a.user.name,
                a_text: a.a_text,
                date: a.date,
                like: a.like,
                view: a.view
            }))
        })))
    })
})

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