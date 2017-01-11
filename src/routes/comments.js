import express from 'express'

import Comment from '../models/comment'
import Post from '../models/post'
import User from '../models/user'

import auth from '../core/auth'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let comment = new Comment()

	comment.user = req.user._id
	comment.post = req.body.comment.post
	comment.body = req.body.comment.body

	comment.save((err, comment) => {
		if (err) {
			return next(err)
		}

		res.send({
			comment: comment
		})

		Post.getUser(comment.post)
			.then(user => !req.user._id.equals(user) && User.notify(user, 'comment', comment.post))
	})
})

router.put('/:id', auth.user, (req, res, next) => {
	Comment.findById(req.params.id)
		.where('user').eq(req.user._id)
		.exec((err, comment) => {
			if (err) {
				return next(err)
			}

			if (!comment) {
				return next()
			}

			comment.body = req.body.comment.body

			comment.save((err, comment) => {
				if (err) {
					return next(err)
				}

				res.send({
					comment: comment
				})
			})
		})
})

router.delete('/:id', auth.user, (req, res, next) => {
	Comment.findById(req.params.id)
		.where('user').eq(req.user._id)
		.exec((err, comment) => {
			if (err) {
				return next(err)
			}

			if (!comment) {
				return next()
			}

			comment.remove(err => {
				if (err) {
					return next(err)
				}

				res.send({
					removed: true
				})
			})
		})
})

export default router
