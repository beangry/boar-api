import mongoose from 'mongoose'
import Notification from './notification'

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
			// push
		})
}

const model = mongoose.model('User', schema)

export default model
