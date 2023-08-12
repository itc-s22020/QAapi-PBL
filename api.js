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
        const payload = {user: user}
        const token = jwt.sign(payload, process.env.SECRET)
        res.status(200).json({message: 'ログイン成功', token: token})
    } else {
        res.status(401).json({message: 'ユーザー名かパスワードが違います'})
    }
})

module.exports = router