import express from 'express'

import Tag from '../models/tag'

import auth from '../core/auth'

const router = express.Router()

router.get('/', auth.user, (req, res, next) => {
	Tag.find()
		.sort('order')
		.exec((err, tags) => {
			if (err) {
				return next(err)
			}

			res.send({
				tags: tags
			})
		})
})

router.post('/', auth.admin, (req, res, next) => {
	let tag = new Tag()

	tag.name = req.body.tag.name
	tag.type = req.body.tag.type
	tag.description = req.body.tag.description
	tag.order = req.body.tag.order

	tag.save((err, tag) => {
		if (err) {
			return next(err)
		}

		res.send({
			tag: tag
		})
	})
})

router.put('/:id', auth.admin, (req, res, next) => {
	Tag.findByIdAndUpdate(req.params.id, req.body.tag, {
		new: true
	})
		.exec((err, tag) => {
			if (err) {
				return next(err)
			}

			res.send({
				tag: tag
			})
		})
})

export default router
