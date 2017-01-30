import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	post: mongoose.Schema.Types.ObjectId,
	details: String,
	created: {
		type: Date,
		default: Date.now
	}
})

schema.index({
	user: 1,
	post: 1
})

const model = mongoose.model('Report', schema)

export default model
