const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const {AuthAdmin} = require('./user')

router.get('', async (req, res) => {
    const categories = await prisma.category.findMany({})
    res.json(categories.map(c => ({id: c.c_id, name: c.c_name})))
})

router.post('/register', AuthAdmin, async (req, res) => {
    const {name} = req.body
    if (!name) {
        res.status(400).json({message: 'カテゴリ名が必要です'})
        return
    }
    await prisma.category.create({
        data: {
            c_name: name
        }
    }).then((r) => {
        res.json({
            message: 'カテゴリ登録完了',
            category: {
                id: r.c_id,
                name: r.c_name
            }
        })
    })
})

router.post('/delete', AuthAdmin, async (req, res) => {
    const id = parseInt(req.body.id)
    if (!id) {
        res.status(400).json({message: 'カテゴリIDが必要です'})
        return
    }
    await prisma.category.delete({
        where: {
            c_id: id
        }
    }).then((r) => {
        res.json({
            message: 'カテゴリ削除完了',
            category: {
                id: r.c_id,
                name: r.c_name
            }
        })
    }).catch(() => {
        res.status(500).json({message: 'カテゴリ削除失敗'})
    })
})

router.post('/edit', AuthAdmin, async (req, res) => {
    const id = parseInt(req.body.id)
    const name = req.body.name
    if (!id || !name) {
        res.status(400).json({message: 'カテゴリIDと新しいカテゴリ名が必要です'})
        return
    }
    await prisma.category.update({
        where: {
            c_id: id
        },
        data: {
            c_name: name
        }
    }).then((r) => {
        res.json({
            message: 'カテゴリ名変更完了',
            category: {
                id: r.c_id,
                name: r.c_name
            }
        })
    }).catch(() => {
        res.status(500).json({message: 'カテゴリ名変更失敗'})
    })
})

module.exports = router