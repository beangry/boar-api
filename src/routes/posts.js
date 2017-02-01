import express from 'express'
import moment from 'moment'

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
	post.hearted = [req.user._id]

	post.save((err, post) => {
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

router.get('/', auth.user, (req, res, next) => {
	const LIMIT = parseInt(process.env.ITEMS_PER_PAGE)

	let count = Post.count()
	let query = Post.find()

	count.where('_id').nin(req.user.reported)
	query.where('_id').nin(req.user.reported)

	count.where('user').nin(req.user.blocked)
	query.where('user').nin(req.user.blocked)

	if (req.query.tag) {
		count.where('tag').eq(req.query.tag)
		query.where('tag').eq(req.query.tag)
	} else if (req.query.type === 'popular') {
		let time = moment().subtract(24, 'hours').toDate()

		count.where('created').gte(time)
		query.where('created').gte(time)
			.sort('-hearts')
	}

	if (req.query.after) {
		query.where('created').gt(req.query.after)
	}

	if (req.query.before) {
		query.where('created').lt(req.query.before)
	}

	query
		.sort('-created')
		.limit(LIMIT)

	let total = 0

	count
		.then(count => total = count)
		.then(() => query)
		.then(posts => {
			res.send({
				posts: posts.map(post => post.toJSON({
					user: req.user._id
				})),
				meta: {
					total: Math.ceil(total / LIMIT)
				}
			})
		})
		.catch(err => next(err))
})

router.get('/:id', auth.user, (req, res, next) => {
	Post.findById(req.params.id)
		.exec((err, post) => {
			if (err) {
				return next(err)
			}

			if (!post) {
				return next()
			}

			if (req.user.reported.indexOf(post._id) >= 0) {
				return next()
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

			let index = post.hearted.indexOf(req.user._id)

			if (index >= 0) {
				post.hearted.splice(index, 1)
				post.hearts--
			} else {
				post.hearted.push(req.user._id)
				post.hearts++
			}

			post.markModified('hearted')

			post.save((err, post) => {
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
})

export default router
