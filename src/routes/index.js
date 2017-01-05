import express from 'express'

const router = express.Router()

router.get('/', (req, res) => res.type('text/plain').send('Boar API v1'))

export default router
