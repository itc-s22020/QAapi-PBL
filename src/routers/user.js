const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
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
        res.status(400).json({
            message: 'ユーザー登録失敗',
        })
    })
})

router.post('/login', async (req, res) => {
    const {user_id, password} = req.body
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
/**
 * 認証が必要なエンドポイントに挟むミドルウェア
 * これ以降の処理では req.user でログイン中のユーザー情報を参照できる
 */
const Auth = (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                res.status(401).json({message: '認証失敗'})
            } else {
                req.user = payload.user
                next()
            }
        })
    } else {
        res.status(403).json({message: 'トークンが必要です'})
    }
}

/**
 * 管理者権限が必要なエンドポイントに挟むミドルウェア
 * これ以降の処理では req.user でログイン中のユーザー情報を参照できる
 */

const AuthAdmin = (req, res, next) => Auth(req, res, async () => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: req.user
        }
    }).then(r => r)
    if (user.admin === true) {
        next()
    } else {
        res.status(403).json({message: '管理者権限が必要です', user: req.user})
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

module.exports = {router, Auth, AuthAdmin}