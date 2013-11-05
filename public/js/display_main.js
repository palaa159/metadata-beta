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