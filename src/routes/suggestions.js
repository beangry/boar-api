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
		.then(suggestion => json(res, 'suggestion', suggestion))
		.catch(err => next(err))
})

export default router
