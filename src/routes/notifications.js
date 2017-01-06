import express from 'express'

import Notification from '../models/notification'

import auth from '../core/auth'

const router = express.Router()

router.get('/', auth.user, (req, res, next) => {
	Notification.find()
		.where('user').eq(req.user._id)
		.sort('-created')
		.exec((err, notifications) => {
			if (err) {
				return next(err)
			}

			res.send({
				notifications: notifications
			})
		})
})

export default router
