const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {PrismaClient} = require('@prisma/client')
const {Auth, AuthAdmin} = require("../middlewares/auth");
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
    const user_id = parseInt(req.body.user_id)
    const name = req.body.name
    const age = parseInt(req.body.age)
    const gender = parseInt(req.body.gender)
    const mail = req.body.mail
    const password = bcrypt.hashSync(req.body.password, 10)
    await prisma.user.create({
        data: {
            user_id: user_id,
            password: password,
            name: name,
            age: age,
            gender: gender,
            mail: mail,
        }
    }).then(() => {
        res.status(200).json({
            message: 'ユーザー登録成功',
            user_id: user_id,
        })
    }).catch(() => {
        res.status(400).json({
            message: 'ユーザー登録失敗',
        })
    })
})

router.post('/login', async (req, res) => {
    const {user_id, password} = req.body
    if (!user_id || !password) {
        res.status(400).json({message: 'ユーザー名、パスワードが必要です'})
        return
    }
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_id
        }
    }).then((r) => r)
    if (user && bcrypt.compareSync(password, user.password)) {
        const payload = {user: user_id}
        const token = jwt.sign(payload, process.env.SECRET)
        res.cookie('token', token, {httpOnly: true})
        res.status(200).json({message: 'ログイン成功', token: token})
    } else {
        res.status(401).json({message: 'ユーザー名かパスワードが違います'})
    }
})

router.get('/logout', Auth, async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({message: 'ログアウトしました'})
})

router.get('/check', Auth, (req, res) => {
    res.status(200).json({message: 'ログインしています', user: req.user})
})

router.get('/checkadmin', AuthAdmin, (req, res) => {
    res.status(200).json({message: '管理者としてログインしています', user: req.user})
})

module.exports = router