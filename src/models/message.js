import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	conversation: {
		type: mongoose.Schema.Types.ObjectId,
		index: true
	},
	from: mongoose.Schema.Types.ObjectId,
	body: String,
	created: {
		type: Date,
		default: Date.now,
		index: true
	}
})

const model = mongoose.model('Message', schema)

export default model
