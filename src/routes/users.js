import express from 'express'

import User from '../models/user'

const router = express.Router()

router.post('/', (req, res, next) => {
	let user = new User()

	user.token = req.body.token

	user.save((err, user) => {
		if (err) {
			return next(err)
		}

		res.send({
			user: user
		})
	})
})

export default router
