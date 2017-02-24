import User from '../models/user'

const auth = (req, res, next, admin) => {
	if (req.headers.token) {
		User.findOne()
			.where('token').eq(req.headers.token)
			.select('+device')
			.select('+role')
			.exec()
			.then(user => {
				if (!user) {
					let err = new Error('User not found')
					err.status = 404

					return next(err)
				}

				if (admin && user.role !== 'admin') {
					let err = new Error('Invalid authentication token')
					err.status = 403

					return next(err)
				}

				req.user = user

				next()
			})
			.catch(() => {
				let err = new Error('Invalid authentication token')
				err.status = 403

				next(err)
			})
	} else {
		let err = new Error('Missing authentication token')
		err.status = 401

		next(err)
	}
}

const admin = (req, res, next) => {
	auth(req, res, next, true)
}

const user = (req, res, next) => {
	auth(req, res, next)
}

export default {
	admin,
	user
}
