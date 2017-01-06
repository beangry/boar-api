import mongoose from 'mongoose'
import shortid from 'shortid'

import Notification from './notification'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
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
	let notification = new Notification()

	notification.user = user
	notification.action = action
	notification.target = target

	notification.save(err => {
		if (err) {
			return console.error('notify', err)
		}

		// push
	})
}

const model = mongoose.model('User', schema)

export default model
