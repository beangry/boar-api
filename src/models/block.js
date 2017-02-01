import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: mongoose.Schema.Types.ObjectId,
	by: mongoose.Schema.Types.ObjectId,
	details: String,
	created: {
		type: Date,
		default: Date.now
	}
})

schema.index({
	user: 1,
	by: 1
})

const model = mongoose.model('Block', schema)

export default model
