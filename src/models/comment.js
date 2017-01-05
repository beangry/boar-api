import mongoose from 'mongoose'
import shortid from 'shortid'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	user: String,
	post: {
		type: String,
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
