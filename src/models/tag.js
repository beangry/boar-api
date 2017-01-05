import mongoose from 'mongoose'
import shortid from 'shortid'

const schema = new mongoose.Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: {
		type: String,
		index: true
	},
	type: String,
	description: String,
	order: {
		type: Number,
		default: 0
	}
})

schema.set('toJSON', {
	transform(doc, ret) {
		ret.links = {
			posts: `/v1/posts?tag=${doc.name}`
		}
	}
})

const model = mongoose.model('Tag', schema)

export default model