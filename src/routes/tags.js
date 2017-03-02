import express from 'express'

import Tag from '../models/tag'

import auth from '../core/auth'
import slug from '../core/slug'

const router = express.Router()

router.post('/', auth.admin, (req, res, next) => {
	let tag = new Tag()

	tag._id = slug(req.body.tag.name)
	tag.name = req.body.tag.name
	tag.type = req.body.tag.type
	tag.order = req.body.tag.order
	tag.related = req.body.tag.related

	tag.save((err, tag) => {
		if (err) {
			return next(err)
		}

		res.send({
			tag: tag
		})
	})
})

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

router.get('/:id', auth.user, (req, res, next) => {
	Tag.findById(req.params.id)
		.exec((err, tag) => {
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
