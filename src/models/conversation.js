import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	members: [mongoose.Schema.Types.ObjectId],
	lastMessage: String,
	readBy: [mongoose.Schema.Types.ObjectId],
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now,
		index: true
	}
})

schema.index({
	members: true
})

schema.index({
	readBy: true
})

schema.set('toJSON', {
	transform(doc, ret, options) {
		delete ret.readBy

		if (options.user) {
			ret.read = doc.readBy.indexOf(options.user) >= 0
		}

		ret.links = {
			messages: `/v1/messages?conversation=${doc._id}`
		}
	}
})

const model = mongoose.model('Conversation', schema)

export default model
