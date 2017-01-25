import express from 'express'

import Conversation from '../models/conversation'
import Message from '../models/message'

import auth from '../core/auth'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let conversation = new Conversation()

	conversation.members = req.body.conversation.members
	conversation.lastMessage = req.body.conversation.lastMessage
	conversation.readBy = [req.user._id]

	conversation.save((err, conversation) => {
		if (err) {
			return next(err)
		}

		res.send({
			conversation: conversation
		})
	})
})

router.get('/', auth.user, (req, res, next) => {
	Conversation.find()
		.where('members').in([req.user._id])
		.sort('-updated')
		.exec((err, conversations) => {
			if (err) {
				return next(err)
			}

			res.send({
				conversations: conversations.map(post => post.toJSON({
					user: req.user._id
				}))
			})
		})
})

router.get('/:id', auth.user, (req, res, next) => {
	Conversation.findById(req.params.id)
		.exec((err, conversation) => {
			if (err) {
				return next(err)
			}

			if (!conversation) {
				return next()
			}

			res.send({
				conversation: conversation.toJSON({
					user: req.user._id
				})
			})
		})
})

router.put('/:id', auth.user, (req, res, next) => {
	Conversation.findOneAndUpdate({
		_id: req.params.id,
		members: {
			$in: [req.user._id]
		},
		readBy: {
			$nin: [req.user._id]
		}
	}, {
		$push: {
			readBy: req.user._id
		}
	}, {
		new: true
	}, (err, conversation) => {
		if (err) {
			return next(err)
		}

		res.send({
			conversation: conversation.toJSON({
				user: req.user._id
			})
		})
	})
})

export default router
