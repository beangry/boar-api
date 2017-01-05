import mongoose from 'mongoose'
import shortid from 'shortid'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	tags: [String],
	token: {
		type: String,
		select: false
	}
})

const model = mongoose.model('User', schema)

export default model
