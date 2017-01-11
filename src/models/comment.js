import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	post: {
		type: mongoose.Schema.Types.ObjectId,
		index: true
	},
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
})

const model = mongoose.model('Comment', schema)

export default model
