import express from 'express'

import User from '../models/user'

import auth from '../core/auth'
import hash from '../core/hash'

const router = express.Router()

router.post('/', (req, res, next) => {
	let user = new User()

	user.token = hash.token()
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

router.post('/:id/block', auth.user, (req, res, next) => {
	if (req.user._id.equals(req.params.id)) {
		let err = new Error(`You can't block yourself`)
		err.status = 400

		return next(err)
	}

	if (req.user.blocked.indexOf(req.params.id) < 0) {
		req.user.blocked.push(req.params.id)

		req.user.markModified('blocked')

		req.user.save()
			.then(() => {
				res.send({
					message: `This user is now blocked, and you won't be seeing any posts from them again`
				})
			})
			.catch(err => next(err))
	} else {
		let err = new Error(`You've already blocked this user`)
		err.status = 400

		next(err)
	}
})

export default router
