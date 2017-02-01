import mongoose from 'mongoose'

import Notification from './notification'

import push from '../core/push'

const schema = new mongoose.Schema({
	email: {
		type: String,
		select: false,
		index: true,
		unique: true
	},
	password: {
		type: String,
		select: false
	},
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
		select: false,
		index: true
	},
	device: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
		select: false
	},
	role: {
		type: String,
		default: 'user',
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

schema.set('toJSON', {
	transform(doc, ret) {
		delete ret.password
		delete ret.role
	}
})

const model = mongoose.model('User', schema)

export default model
