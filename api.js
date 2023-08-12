const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => res.send('test'))

router.get('/sample', (req, res) => {
    res.json({message: 'test api'})
})

router.post('/user/register', async (req, res) => {
    const {user_id, name, age, gender, mail} = req.body
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
        res.status(503).json({
            message: 'ユーザー登録失敗',
        })
    })
})

router.post('/user/login', async (req, res) => {
    const {user_id, password} = req.body
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_id
        }
    }).then((r) => r)
    if (user && bcrypt.compareSync(password, user.password)) {
        const {password, ...data_without_pass} = user
        const payload = {user: data_without_pass}
        const token = jwt.sign(payload, process.env.SECRET)
        res.status(200).json({message: 'ログイン成功', token: token})
    } else {
        res.status(401).json({message: 'ユーザー名かパスワードが違います'})
    }
})
/**
 * 認証が必要なエンドポイントに挟むミドルウェア
 * これ以降の処理では req.user でログイン中のユーザー情報を参照できる
 */
const Auth = (req, res, next) => {
    const token = req.headers.authorization
    if (token && token.split(' ')[0] === 'Bearer') {
        jwt.verify(token.split(' ')[1], process.env.SECRET, (err, payload) => {
            if (err) {
                res.status(403).json({message: '認証失敗'})
            } else {
                req.user = payload.user
                next()
            }
        })
    } else {
        res.status(403).json({message: 'トークンが必要です'})
    }
}

router.get('/user/check', Auth, (req, res) => {
    res.status(200).json({message: 'ログインしています', user: req.user})
})


module.exports = router