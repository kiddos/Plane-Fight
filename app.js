var dgram = require("dgram");

var socket = dgram.createSocket('udp4');
console.log("server udp socket created");

var port = 6060;
socket.bind(port);
console.log("server bind to %d", port);

socket.on('message', function(msg, rinfo) {
	console.log("Receive %d bytes from %s:%d\n", msg.length, rinfo.address, rinfo.port);
});
console.log("server start listening to messages");



