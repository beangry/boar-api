import express from 'express'

import Block from '../models/block'

import auth from '../core/auth'
import json from '../core/json'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	if (req.user.blocked.indexOf(req.body.block.user) < 0) {
		let block = new Block()

		block.user = req.body.block.user
		block.by = req.user._id
		block.details = req.body.block.details

		block.save()
			.then(block => {
				json(res, 'block', block)

				req.user.blocked.push(req.body.block.user)

				req.user.markModified('blocked')

				req.user.save()
			})
			.catch(err => next(err))
	} else {
		let err = new Error('Already blocked')
		err.status = 400

		next(err)
	}
})

export default router
