import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	action: String,
	target: mongoose.Schema.Types.ObjectId,
	read: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
})

schema.index({
	user: 1,
	action: 1,
	target: 1
})

schema.statics.add = function(user, action, target) {
	return new Promise((resolve, reject) => {
		this.findOneAndUpdate({
			user: user,
			action: action,
			target: target
		}, {
			updated: Date.now()
		}, {
			new: true,
			setDefaultsOnInsert: true,
			upsert: true
		}, (err, notification) => {
			if (err) {
				reject(err)

				return console.error('Notification.add', err)
			}

			resolve(notification)
		})
	})
}

const model = mongoose.model('Notification', schema)

export default model
