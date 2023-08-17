const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth, AuthAdmin} = require('../middlewares/auth')
const SetLiked = require("../middlewares/like");

router.get('', async (req, res) => {
    const query = req.query.query
    const user_id = req.query.user_id
    const c_id = parseInt(req.query.c_id)
    const whereQuery = {where: {}}
    const appendQuery = (data) => whereQuery.where = {...data, ...whereQuery.where}
    // それぞれパラメータが設定されていれば検索条件に追加していく
    if (query) {
        // キーワードごとに '{q_text: キーワード}' と '{title: キーワード}' という条件を追加していく
        const keywords = query.split(' ')
        const orQuery = []
        keywords.forEach((keyword) => ['q_text', 'title'].map((column) => orQuery.push({[column]: {contains: keyword}})))
        appendQuery({OR: orQuery})
    }
    if (user_id) appendQuery({user_id: user_id})
    if (c_id) appendQuery({c_id: c_id})
    await prisma.question.findMany({
        include: {
            user: true,
            category: true,
            best_a: {
                include: {
                    user: true,
                }
            }
        },
        ...whereQuery
    }).then((r) => {
        res.json(r.map(questionToJSON))
    })
})

router.post('/new', Auth, async (req, res) => {
    const c_id = parseInt(req.body.c_id)
    const q_text = req.body.q_text
    const title = req.body.title
    if (!c_id || !q_text || !title) {
        res.status(400).json({message: 'カテゴリID、タイトル、質問本文が必要です。'})
        return
    }
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
        res.status(400).json({
            message: '質問投稿失敗'
        })
    })
})

router.get('/:q_id', async (req, res, next) => {
    const q_id = parseInt(req.params.q_id)
    if (!q_id) {
        next()
        return
    }
    await prisma.question.findUnique({
        where: {
            q_id: q_id
        },
        include: {
            user: true,
            category: true,
            answers: {
                include: {
                    user: true
                }
            },
            best_a: {
                include: {
                    user: true
                }
            },
        }
    }).then((q) => {
        if (!q) return res.status(404).json({message: '質問が見つかりませんでした。'})
        res.json({
            ...questionToJSON(q),
            answers: q.answers.map(answerToJSON)
        })
    })
})

router.post('/delete', AuthAdmin, async (req, res) => {
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: '質問IDが必要です'})
        return
    }
    const deleteAnswers = prisma.answer.deleteMany({
        where: {
            q_id: id
        }
    })
    const deleteQuestions = prisma.question.deleteMany({
        where: {
            q_id: id
        }
    })
    await prisma.$transaction([deleteAnswers, deleteQuestions])
        .then(() => {
            res.json({
                message: '質問削除完了'
            })
        }).catch(() => {
            res.status(500).json({message: '質問削除失敗'})
        })
})

router.post('/like', Auth, SetLiked(0, true))

router.post('/unlike', Auth, SetLiked(0, false))

const questionToJSON = (q) => {
    if (!q) return null
    return {
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
        best_a: answerToJSON(q.best_a)
    }
}
const answerToJSON = (a) => {
    if (!a) return null
    return {
        a_id: a.a_id,
        user_id: a.user_id,
        user_name: a.user.name,
        a_text: a.a_text,
        date: a.date,
        like: a.like,
        view: a.view
    }
}

module.exports = router