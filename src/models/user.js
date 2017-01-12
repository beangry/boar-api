import mongoose from 'mongoose'

import Notification from './notification'

import push from '../core/push'

const schema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String,
		select: false
	},
	device: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
		select: false
	}
})

schema.statics.notify = function(user, action, target) {
	Notification.add(user, action, target)
		.then(notification => {
			this.findById(user)
				.select('device')
				.exec((err, user) => {
					if (err || !user) {
						return console.error('User.notify', err || 'user not found')
					}

					push(user.device, notification)
				})
		})
}

const model = mongoose.model('User', schema)

export default model
