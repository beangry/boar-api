import express from 'express'

import Report from '../models/report'
import Post from '../models/post'

import auth from '../core/auth'

const router = express.Router()

router.get('/', auth.admin, (req, res, next) => {
	const LIMIT = parseInt(process.env.ITEMS_PER_PAGE)

	let total = 0
	let reports = []
	let posts = []

	Report.count()
		.then(count => total = count)
		.then(() =>
			Report.find()
				.sort('-created')
				.skip(req.query.page * LIMIT)
				.limit(LIMIT)
		)
		.then(data => reports = data)
		.then(() => reports.map(report => report.post))
		.then(posts =>
			Post.find()
				.where('_id').in(posts)
		)
		.then(data => posts = data)
		.then(() => {
			res.send({
				posts,
				reports,
				meta: {
					total: Math.ceil(total / LIMIT)
				}
			})
		})
		.catch(err => next(err))
})

export default router
