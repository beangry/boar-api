import mongoose from 'mongoose'

import Notification from './notification'

import push from '../core/push'

const schema = new mongoose.Schema({
	reported: [mongoose.Schema.Types.ObjectId],
	notifications: {
		type: Boolean,
		default: true
	},
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
				.select('notifications device')
				.exec((err, user) => {
					if (err || !user) {
						return console.error('User.notify', err || 'user not found')
					}

					if (user.notifications) {
						push(user.device, notification)
					}
				})
		})
}

const model = mongoose.model('User', schema)

export default model
