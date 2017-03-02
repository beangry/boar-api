import express from 'express'
import moment from 'moment'

import Comment from '../models/comment'
import Post from '../models/post'
import Report from '../models/report'
import Suggestion from '../models/suggestion'
import Tag from '../models/tag'
import User from '../models/user'

import auth from '../core/auth'
import json from '../core/json'

const router = express.Router()

const sort = (a, b) => {
	if (a.date > b.date) {
		return 1
	}

	if (a.date < b.date) {
		return -1
	}

	return 0
}

router.get('/', auth.admin, (req, res, next) => {
	let comment = Comment.count()
	let post = Post.count()
	let report = Report.count()
	let suggestion = Suggestion.count()
	let tag = Tag.count()
	let user = User.count()

	let promises = [
		comment,
		post,
		report,
		suggestion,
		tag,
		user
	]

	Promise.all(promises)
		.then(data =>
			res.send({
				comments: data.shift(),
				posts: data.shift(),
				reports: data.shift(),
				suggestions: data.shift(),
				tags: data.shift(),
				users: data.shift()
			})
		)
		.catch(err => next(err))
})

router.get('/tags', auth.admin, (req, res, next) => {
	Tag.find()
		.sort('order')
		.select('type order')
		.exec()
		.then(tags => {
			let types = []
			let data = []

			tags.forEach(tag => {
				if (types.indexOf(tag.type) < 0) {
					types.push(tag.type)

					data.push({
						name: tag.type,
						order: tag.order
					})
				}
			})

			res.send(data)
		})
		.catch(err => next(err))
})

router.get('/posts', auth.admin, (req, res, next) => {
	let criteria = moment().subtract(1, 'month').toDate()

	Post.aggregate({
		$match: {
			created: {
				$gte: criteria
			}
		},
	}, {
		$group: {
			_id: {
				$dayOfMonth: '$created'
			},
			date: {
				$first: '$created'
			},
			count: {
				$sum: 1
			}
		}
	}, (err, data) => {
		if (err) {
			return next(err)
		}

		let posts = data.sort(sort).map((post, index) => {
			let date = moment(post.date).format('l')

			return {
				index,
				label: date,
				value: post.count
			}
		})

		res.send(posts)
	})
})

router.get('/users', auth.admin, (req, res, next) => {
	let criteria = moment().subtract(1, 'month').toDate()

	User.aggregate({
		$match: {
			created: {
				$gte: criteria
			}
		},
	}, {
		$group: {
			_id: {
				$dayOfMonth: '$created'
			},
			date: {
				$first: '$created'
			},
			count: {
				$sum: 1
			}
		}
	}, (err, data) => {
		if (err) {
			return next(err)
		}

		let users = data.sort(sort).map((user, index) => {
			let date = moment(user.date).format('l')

			return {
				index,
				label: date,
				value: user.count
			}
		})

		res.send(users)
	})
})

export default router
