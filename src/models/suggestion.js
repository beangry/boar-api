import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	tag: String,
	description: String,
	created: {
		type: Date,
		default: Date.now
	}
})

const model = mongoose.model('Suggestion', schema)

export default model
