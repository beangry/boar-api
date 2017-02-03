import request from 'request'

const push = (device, notification) => {
	if (!device || !device.token) {
		return
	}

	let body = null

	switch (notification.action) {
		case 'comment':
			body = 'Someone commented on your post'

			break

		default:
			return
	}

	request({
		method: 'post',
		uri: 'https://fcm.googleapis.com/fcm/send',
		body: {
			notification: {
				body: body,
				click_action: 'FCM_PLUGIN_ACTIVITY'
			},
			data: {
				action: notification.action,
				target: notification.target
			},
			priority: 'high',
			to: device.token
		},
		json: true,
		headers: {
			'Authorization': `key=${process.env.FCM_SERVER_KEY}`
		}
	}, err => err && console.error('push', err))
}

export default push
