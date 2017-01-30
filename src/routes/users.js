import express from 'express'

import User from '../models/user'

import auth from '../core/auth'
import hash from '../core/hash'

const router = express.Router()

router.post('/', (req, res, next) => {
	let user = new User()

	user.token = hash()
	user.device = req.body.user.device

	user.save((err, user) => {
		if (err) {
			return next(err)
		}

		res.send({
			user: user
		})
	})
})

router.get('/:id', auth.user, (req, res, next) => {
	if (req.user._id.equals(req.params.id)) {
		res.send({
			user: req.user
		})
	} else {
		next()
	}
})

router.put('/:id', auth.user, (req, res, next) => {
	req.user.notifications = req.body.user.notifications
	req.user.device = req.body.user.device

	if (req.user.isModified()) {
		req.user.save((err, user) => {
			if (err) {
				return next(err)
			}

			res.send({
				user: user
			})
		})
	} else {
		res.send({
			user: req.user
		})
	}
})

export default router
