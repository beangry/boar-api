import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		index: true
	},
	tag: {
		type: String,
		index: true
	},
	body: String,
	hearted: [mongoose.Schema.Types.ObjectId],
	hearts: {
		type: Number,
		default: 1,
		index: true
	},
	created: {
		type: Date,
		default: Date.now,
		index: true
	}
})

schema.statics.getUser = function(id) {
	return new Promise((resolve, reject) => {
		this.findById(id)
			.select('user')
			.exec((err, post) => {
				if (err) {
					return reject(err)
				}

				if (!post) {
					return reject()
				}

				resolve(post.user)
			})
	})
}

schema.set('toJSON', {
	transform(doc, ret, options) {
		delete ret.hearted

		if (options.user) {
			ret.liked = doc.hearted.indexOf(options.user) >= 0
		}

		ret.links = {
			comments: `/v1/posts/${doc._id}/comments`
		}
	}
})

const model = mongoose.model('Post', schema)

export default model
