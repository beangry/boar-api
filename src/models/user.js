import mongoose from 'mongoose'
import shortid from 'shortid'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	created: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String,
		select: false
	},
	device: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
		select: false
	}
})

const model = mongoose.model('User', schema)

export default model
