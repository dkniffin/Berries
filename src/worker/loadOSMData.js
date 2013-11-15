B.OSMData = {};

B.Worker.addMsgHandler('loadOSMData', function (e) {
	var dataURL = e.data.url;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', dataURL, true);
	xhr.onload = function () {
		B.OSMData = JSON.parse(xhr.responseText);
	};
	B.Logger.log('info', 'Loading OSM Data');
	xhr.send(null);
});