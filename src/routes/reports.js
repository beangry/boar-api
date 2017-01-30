import express from 'express'

import Report from '../models/comment'

import auth from '../core/auth'
import json from '../core/json'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let report = new Report()

	report.user = req.user._id
	report.post = req.body.report.post
	report.details = req.body.report.details

	report.save()
		.then(report => {
			json(res, 'report', report)

			req.user.reported.push(req.body.report.post)

			req.user.markModified('reported')

			req.user.save()
		})
		.catch(err => next(err))
})

export default router
