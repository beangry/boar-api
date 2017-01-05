import express from 'express'

import Post from '../models/post'
import Comment from '../models/comment'
import User from '../models/user'

import auth from '../core/auth'

const router = express.Router()

router.post('/', auth.user, (req, res, next) => {
	let post = new Post()

	post.user = req.user._id
	post.tag = req.body.post.tag
	post.body = req.body.post.body

	post.save((err, post) => {
		if (err) {
			return next(err)
		}

		res.send({
			post: post
		})
	})
})

router.get('/', auth.user, (req, res, next) => {
	let query = Post.find()

	if (req.query.tag) {
		query
			.where('tag').eq(req.query.tag)
	}

	query
		.sort('-created')
		.skip(req.query.skip || 0)
		.limit(parseInt(process.env.ITEMS_PER_PAGE))
		.exec((err, posts) => {
			if (err) {
				return next(err)
			}

			res.send({
				posts: posts.map(post => post.toJSON({
					user: req.user._id
				}))
			})
		})
})

router.get('/:id', auth.user, (req, res, next) => {
	Post.findById(req.params.id)
		.exec((err, post) => {
			if (err) {
				return next(err)
			}

			res.send({
				post: post.toJSON({
					user: req.user._id
				})
			})
		})
})

router.get('/:id/comments', auth.user, (req, res, next) => {
	Comment.find()
		.where('post').eq(req.params.id)
		.sort('-created')
		.exec((err, comments) => {
			if (err) {
				return next(err)
			}

			res.send({
				comments: comments
			})
		})
})

router.post('/:id/heart', auth.user, (req, res, next) => {
	Post.findById(req.params.id)
		.exec((err, post) => {
			if (err) {
				return next(err)
			}

			let index = post.hearts.indexOf(req.user._id)

			if (index >= 0) {
				post.hearts.splice(index, 1)
			} else {
				post.hearts.push(req.user._id)
			}

			post.markModified('hearts')

			post.save((err, post) => {
				if (err) {
					return next(err)
				}

				res.send({
					post: post
				})
			})
		})
})

export default router
