import mongoose from 'mongoose'
import shortid from 'shortid'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	user: String,
	action: String,
	target: String,
	created: {
		type: Date,
		default: Date.now
	}
})

const model = mongoose.model('Notification', schema)

export default model
