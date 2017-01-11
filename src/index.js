import dotenv from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import logger from 'morgan'
import cors from 'cors'

import mongoose from 'mongoose'

mongoose.Promise = Promise

mongoose.connect(process.env.MONGODB_URI, err => {
	if (err) throw err
})

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())

import routes from './routes/index'
import users from './routes/users'
import posts from './routes/posts'
import comments from './routes/comments'
import tags from './routes/tags'
import notifications from './routes/notifications'

app.use('/', routes)
app.use('/v1/users', users)
app.use('/v1/posts', posts)
app.use('/v1/comments', comments)
app.use('/v1/tags', tags)
app.use('/v1/notifications', notifications)

app.use((req, res, next) => {
	let err = new Error('Not found')
	err.status = 404

	next(err)
})

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		message: err.message
	})
})

export default app
