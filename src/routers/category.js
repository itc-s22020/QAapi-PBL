const express = require('express')
const router = express.Router()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

router.get('', async (req, res) => {
    const categories = await prisma.category.findMany({})
    res.json(categories.map(c => ({id: c.c_id, name: c.c_name})))
})

module.exports = router