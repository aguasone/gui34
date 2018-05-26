const io = require('socket.io-client')
const socket = io('http://localhost:3000')
	socket.emit('debug');
socket.on ('toggleDebug', function (data) {
process.exit()
	});
