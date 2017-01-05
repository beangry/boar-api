import crypto from 'crypto'
import shortid from 'shortid'

const hash = () => crypto.createHash('sha256').update(shortid.generate() + Date.now()).digest('hex')

export default hash
