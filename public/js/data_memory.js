var ipArray = [];

var sW = window.innerWidth,
	sH = window.innerHeight,
	mapHeight = $('#imgMap').height();

window.addEventListener('load', onLoad, false);
window.addEventListener('resize', onResize, false);

function onLoad() {
}

function onResize() {
	sW = window.innerWidth;
	sH = window.innerHeight;
	$('#imgMap').attr({
		width: sW
	});
	mapHeight = $('#imgMap').height();
}

socket.on('destination ip', function(data) {
	if($.inArray(data.ip, ipArray) !== 0) {
		console.log('!!! ALREADY IN IPARRAY !!!');
	} else {
		console.log('!!! PUSH TO IPARRAY !!!');
	}
	// data.ip, data.bullshit
	// if not in array then push
	// data.ip
	// call freegeoip
	$.ajax({
		url: 'http://freegeoip.net/json/' + data.ip,
		dataType: 'jsonp',
		type: 'GET',
		success: function(data) {
			console.log('I just got a location data');
			locData.push({
				ip: data.ip,
				lat: data.latitude,
				lng: data.longitude,
				city: data.city,
				country: data.country_name,
				hit: 1,
				bytesSent: 0
			});
			console.log('It\'s been pushed!');
		},
		error: function(request, status, error) {
			console.log('errrorerrrorerrrorerrrorerrror');
			// remove ipArray
			ipArray.pop();
		}
		});
});