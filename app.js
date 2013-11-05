var googips = ['173.194', '74.125.226', '74.125.228'],
	// contains 173.194 or  analytic = 74.125 or akamaihd = 23.67.244
	bullshitips = ['gstatic', 'dropbox', 'chartbeat', '74.125.228', 'imgclck', 'doubleclick', 'dishdigital', 'dmtry'],
	facebookips = ['31.13.69.160'],
	twitterips = ['199.16.156'],
	usefulFilter = ['suggestqueries', '?q=', 'yimg', 'distilleryimage', 'pinimg', '/wiki/', '.ico'];

// VARIABLES
var pcap = require("pcap"),
	os = require('os'),
	ifaces = os.networkInterfaces(),
	idev = 'en0',
	pcap_session = pcap.createSession(idev, "tcp"),
	matcher = /safari/i,
	tcp_tracker = new pcap.TCP_tracker(),
	child_proess = require('child_process').exec(),
	ip,
	time;
// webserver
var connect = require('connect'),
	port = 3000,
	sPort = 3001,
	app = connect.createServer(
		connect.static(__dirname + '/public') // two underscores
	).listen(port);
// socket communication
io = require('socket.io').listen(app);
io.set('log level', 2); // reduce logging
io.sockets.on('connection', function(socket) {
	time = new Date().getTime();
	socket.emit('greet', {
		time: time
	});
	// identify connector's ID
	// TODO - write a policy, statement
	socket.on('connection ip', function(data) {
		ip = data.ip;
	});
});

// find ip address
for (var dev in ifaces) {
	var alias = 0;
	ifaces[dev].forEach(function(details) {
		if (details.family == 'IPv4' && details.internal == false) {
			ip = details.address;
			// console.log(details.address);
		}
	});
}
//
console.log("Listening on " + pcap_session.device_name + " on IP: " + ip);

// when there's a packet coming
pcap_session.on('packet', function(raw_packet) {
	var packet = pcap.decode.packet(raw_packet),
		src_ip = packet.link.ip.saddr,
		src_port = packet.link.ip.tcp.sport,
		dst_ip = packet.link.ip.daddr,
		dst_port = packet.link.ip.tcp.dport,
		data_byte = packet.link.ip.tcp.data_bytes,
		data = packet.link.ip.tcp.data;

	// inject google ips

	function checkGoogleIP(ip, array) {
		// console.log(ip);
		// console.log('starting checkGoogleIP with ' + ip);
		for (var i = 0; i < array.length; i++) {
			if (ip.match(array[i])) {
				// console.log('match ' + ip + ' and ' + array[i]);
				return true;
			}
		}
		return false;
	}
	// test checkGoogleIP function
	// checkGoogleIP(dst_ip, googips);

	function data_google() {
		if (src_ip == ip && data_byte > 0) {
			console.log('data ' + data_byte);
			io.sockets.emit('data all', {
				size: data_byte
			});
		}
		if (src_ip == ip && data_byte > 0 && checkGoogleIP(dst_ip, googips) == true) {
			console.log('ding!–––––––––it\'s google–––––––––' + ' with ' + data_byte + ' bytes');
			io.sockets.emit('data google', {
				size: data_byte
			});
		}
	}

	data_google();

	function data_all() {
		// if I just sent whatever data
		if (src_ip == ip && data_byte > 0) {
			// console.log('ding! with ' + data_byte + ' bytes to ' + dst_ip + ':' + dst_port);
			io.sockets.emit('sending data', {
				to: dst_ip,
				port: dst_port,
				size: data_byte
			});
		}
	}

	function data_http_request() {
		// if user is making http request
		if (data && matcher.test(data.toString())) {
			console.log(pcap.print.packet(packet));
			var query = data.toString();
			// find Host + GET
			// substring >H<ost and before Connection
			var host = query.substring(query.indexOf('Host: ') + 6, query.indexOf('Connection:') - 2);
			var url = query.substring(query.indexOf('/'), query.indexOf(' HTTP/1.1'));
			var uri = 'http://' + host + url;
			console.log(uri + '\n----------------------');
		}
	}
});