import 'newrelic'

import dotenv from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import logger from 'morgan'
import cors from 'cors'

import mongoose from 'mongoose'

mongoose.Promise = Promise

mongoose.connect(process.env.MONGOHQ_URL, err => {
	if (err) throw err
})

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())

import routes from './routes/index'
import comments from './routes/comments'
import data from './routes/data'
import notifications from './routes/notifications'
import posts from './routes/posts'
import sessions from './routes/sessions'
import suggestions from './routes/suggestions'
import tags from './routes/tags'
import users from './routes/users'

app.use('/', routes)
app.use('/v1/comments', comments)
app.use('/v1/data', data)
app.use('/v1/notifications', notifications)
app.use('/v1/posts', posts)
app.use('/v1/sessions', sessions)
app.use('/v1/suggestions', suggestions)
app.use('/v1/tags', tags)
app.use('/v1/users', users)

app.use((req, res, next) => {
	let err = new Error('Not found')
	err.status = 404

	next(err)
})

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	if (process.env.NODE_ENV === 'development') {
		console.error(err)
	}

	res.send({
		message: err.message
	})
})

export default app
