import express from 'express'
import moment from 'moment'

import Post from '../models/post'
import User from '../models/user'

import auth from '../core/auth'
import json from '../core/json'

const router = express.Router()

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

		let posts = data.map(post => {
			let date = moment(post.date).format('l')

			return {
				label: date,
				value: post._id
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

		let users = data.map(user => {
			let date = moment(user.date).format('l')

			return {
				label: date,
				value: user._id
			}
		})

		res.send(users)
	})
})

export default router
