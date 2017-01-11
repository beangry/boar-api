import express from 'express'

import Notification from '../models/notification'

import auth from '../core/auth'

const router = express.Router()

router.get('/', auth.user, (req, res, next) => {
	Notification.find()
		.where('user').eq(req.user._id)
		.sort('-updated')
		.exec((err, notifications) => {
			if (err) {
				return next(err)
			}

			res.send({
				notifications: notifications
			})
		})
})

router.put('/:id', auth.user, (req, res, next) => {
	Notification.findOneAndUpdate({
		_id: req.params.id,
		user: req.user._id
	}, {
		read: req.body.notification.read
	}, {
		new: true
	}, (err, notification) => {
		if (err) {
			return next(err)
		}

		res.send({
			notification: notification
		})
	})
})

export default router
