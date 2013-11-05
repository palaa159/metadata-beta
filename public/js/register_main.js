var IP;
$(document).ready(function() {
	$.getJSON("http://smart-ip.net/geoip-json?callback=?",
		function(data) {
			IP = data.host;
			console.log(data.host);
		}
	);
});

// FIND IP
var IP,
	IPs = [],
	locations = [];
// SOCKET.IO
var app = {
	begin_track: null
};
// 
socket.on('greet', function(data) {
	// send back IP
	socket.emit('connection ip', {
		ip: IP
	});
	app.begin_track = data.time;
	console.log(moment(app.begin_track).fromNow());
});

socket.on('sending data', function(data) {
	var toIP = data.to,
		port = data.port,
		size = data.size;
	// check existence
	if($.inArray(IPs) !== 1) {
		IPs.push(toIP);
		getLocation(toIP);
	}
});

function getLocation(location) {

}