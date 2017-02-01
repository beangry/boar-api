import crypto from 'crypto'
import shortid from 'shortid'

const password = password => crypto.createHash('sha256').update(password).digest('hex')

const token = () => crypto.createHash('sha256').update(shortid.generate() + Date.now()).digest('hex')

export default {
	password,
	token
}
