import express from 'express'

import Message from '../models/message'
import Conversation from '../models/conversation'
import User from '../models/user'

import auth from '../core/auth'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let message = new Message()

	message.conversation = req.body.message.conversation
	message.from = req.body.message.from
	message.body = req.body.message.body

	message.save((err, message) => {
		if (err) {
			return next(err)
		}

		res.send({
			message: message
		})

		User.notify(message.to, 'message', message.conversation)

		Conversation.findByIdAndUpdate(message.conversation, {
			lastMessage: message.body,
			readBy: [req.user._id],
			updated: Date.now()
		}).exec()
	})
})

router.get('/', auth.user, (req, res, next) => {
	const LIMIT = parseInt(process.env.ITEMS_PER_PAGE)

	let query = Message.find()
		.where('conversation').eq(req.query.conversation)

	if (req.query.after) {
		query.where('created').gt(req.query.after)
	}

	if (req.query.before) {
		query.where('created').lt(req.query.before)
	}

	query
		.sort('created')
		.limit(LIMIT)

	query.then(messages => res.send({
		messages: messages
	}))
		.catch(err => next(err))
})

export default router
