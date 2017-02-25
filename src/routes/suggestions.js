import express from 'express'

import Suggestion from '../models/suggestion'

import auth from '../core/auth'
import json from '../core/json'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let suggestion = new Suggestion()

	suggestion.user = req.user._id
	suggestion.tag = req.body.suggestion.tag
	suggestion.description = req.body.suggestion.description

	suggestion.save()
		.then(() =>
			res.send({
				message: 'Thank you for your submission'
			})
		)
		.catch(err => next(err))
})

router.get('/', auth.admin, (req, res, next) => {
	const LIMIT = parseInt(process.env.ITEMS_PER_PAGE)

	Suggestion.count()
		.then(total => {
			Suggestion.find()
				.sort('-created')
				.skip(req.query.page * LIMIT)
				.limit(LIMIT)
				.exec()
				.then(suggestions => {
					res.send({
						suggestions,
						meta: {
							total: Math.ceil(total / LIMIT)
						}
					})
				})
				.catch(err => next(err))
		})
})

router.delete('/:id', auth.admin, (req, res, next) => {
	Suggestion.findByIdAndRemove(req.params.id)
		.then(() => res.send({
			message: 'Suggestion removed'
		}))
		.catch(err => next(err))
})

export default router
