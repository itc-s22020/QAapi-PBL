const jwt = require("jsonwebtoken");
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
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

module.exports = {Auth, AuthAdmin}