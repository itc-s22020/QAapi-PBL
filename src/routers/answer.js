const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth, AuthAdmin} = require('./user')

router.post('/new', Auth, async (req, res) => {
    const a_text = req.body.a_text
    const q_id = parseInt(req.body.q_id)
    if (!q_id || !a_text) {
        res.status(400).json({message: '質問ID、回答本文が必要です。'})
        return
    }
    const question = await prisma.question.findUnique({
        where: {
            q_id: q_id
        }
    }).then(r => r)
    if (question.user_id === req.user) {
        res.status(400).json({
            message: '自分の質問に回答を投稿することはできません'
        })
        return
    }
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
        return
    }
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
})

router.post('/delete', AuthAdmin, async (req, res) => {
    const id = parseInt(req.body.id)
    if (id) {
        await prisma.answer.delete({
            where: {
                a_id: parseInt(id)
            },
            include: {
                question: true
            }
        }).then((r) => {
            res.json({
                message: '回答削除完了',
                answer: {
                    a_text: r.a_text,
                },
                question: {
                    user_id: r.question.user_id,
                    title: r.question.title,
                    q_text: r.question.q_text
                }
            })
        }).catch(() => {
            res.status(500).json({message: '回答削除失敗'})
        })
    } else {
        res.status(400).json({message: '回答IDが必要です'})
    }
})

module.exports = router