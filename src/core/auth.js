import User from '../models/user'

const admin = (req, res, next) => {
	if (req.headers.admin === process.env.ADMIN_KEY) {
		next()
	} else {
		let err = new Error()
		err.status = 403

		next(err)
	}
}

const user = (req, res, next) => {
	if (req.headers.token) {
		User.findOne()
			.where('token').eq(req.headers.token)
			.select('+device')
			.exec((err, user) => {
				if (err || !user) {
					err = new Error('Invalid authentication token')
					err.status = 403

					return next(err)
				}

				req.user = user

				next()
			})
	} else {
		let err = new Error('Missing authentication token')
		err.status = 401

		next(err)
	}
}

export default {
	admin,
	user
}
