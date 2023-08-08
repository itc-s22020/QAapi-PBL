const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('test'))

router.get('/sample', (req, res) => {
    res.json({message: 'test api'})
})

module.exports = router