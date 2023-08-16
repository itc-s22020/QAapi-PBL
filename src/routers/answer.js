const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {Auth} = require('./user')

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
            message: '自分の質問に回答を投稿することはできません。'
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
            message: 'あなたはこの質問に回答済みです。'
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

router.post('/delete', Auth, async (req, res) => {
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: '回答IDが必要です'})
        return
    }
    await prisma.answer.findUnique({
        where: {
            a_id: id
        }
    }).then(async (r) => {
        if (!r) {
            res.status(400).json({message: '回答データが見つかりませんでした。'})
            return
        }
        if (r.user_id !== req.user) {
            res.status(400).json({message: '他人の回答は削除できません。'})
            return
        }
        await prisma.answer.delete({
            where: {
                a_id: id
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
    })
})

router.post('/like', Auth, async (req, res) => {
    const target_type = 1
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: '回答IDが必要です'})
        return
    }
    await prisma.answer.findUnique({
        where: {
            a_id: id
        }
    }).then(async (a) => {
        if (!a) return res.status(404).json({message: '回答が見つかりませんでした。'})
        const likeData = {
            target_type: target_type,
            user_id: req.user,
            target_id: id
        }
        await prisma.like.findUnique({
            where: {like_identifier: likeData}
        }).then(async (r) => {
            if (r) {
                res.status(400).json({message: 'この回答はいいね済みです。'})
                return
            }
            const increaseLikeCount = prisma.answer.update({
                where: {
                    a_id: id
                },
                data: {
                    like: a.like + 1
                }
            })
            const createLikeData = prisma.like.create({
                data: likeData
            })
            await prisma.$transaction([increaseLikeCount, createLikeData])
                .then(() => {
                    res.status(200).json({message: '回答にいいねしました。'})
                })
        })
    })
})

router.post('/unlike', Auth, async (req, res) => {
    const target_type = 1
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: '回答IDが必要です'})
        return
    }
    await prisma.answer.findUnique({
        where: {
            a_id: id
        }
    }).then(async (a) => {
        if (!a) return res.status(404).json({message: '回答が見つかりませんでした。'})
        const likeData = {
            target_type: target_type,
            user_id: req.user,
            target_id: id
        }
        await prisma.like.findUnique({
            where: {like_identifier: likeData}
        }).then(async (r) => {
            if (!r) {
                res.status(400).json({message: 'この回答はいいねしていません。'})
                return
            }
            const decreaseLikeCount = prisma.answer.update({
                where: {
                    a_id: id
                },
                data: {
                    like: a.like - 1
                }
            })
            const deleteLikeData = prisma.like.delete({
                where: {like_identifier: likeData}
            })
            await prisma.$transaction([decreaseLikeCount, deleteLikeData])
                .then(() => {
                    res.status(200).json({message: '回答へのいいねを解除しました。'})
                })
        })
    })
})

module.exports = router