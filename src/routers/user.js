const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {PrismaClient} = require('@prisma/client')
const {Auth, AuthAdmin} = require("../middlewares/auth");
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
    const user_id = req.body.user_id
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
    }).catch((e) => {
        console.log(e)
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

router.get('/info/:user_id', async (req, res) => {
    const {user_id} = req.params
    if (!user_id) {
        res.status(400).json({message: 'ユーザーID'})
        return
    }
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_id
        }
    }).then((r) => r)
    if (!user) {
        res.status(404).json({message: 'ユーザーが見つかりませんでした。'})
        return
    }
    const {name, age, like, admin, date_joined} = user
    // 0->男性 1->女性 それ以外->無回答
    const gender = user.gender === 0 ? '男性' : user.gender === 1 ? '女性' : '無回答'
    res.status(200).json({
        user_id: user_id,
        name: name,
        age: age,
        gender: gender,
        like: like,
        admin: admin,
        date_joined: date_joined
    })
})

router.get('/ranking', async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: [
            {
                like: 'desc'
            }
        ]
    })
    const data = users.map((user) => {
        const {user_id, name, age, gender, like, admin, date_joined} = user
        return {user_id, name, age, gender, like, admin, date_joined}
    })
    res.status(200).json(data)
})

module.exports = router