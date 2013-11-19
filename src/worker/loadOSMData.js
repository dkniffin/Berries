B.OSMData = {};

B.Worker.addMsgHandler('loadOSMData', function (e) {
	var dataURL = B.OSMData.url = e.data.url;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', dataURL, true);
	xhr.onload = function () {
		var data = B.OSMData.data = JSON.parse(xhr.responseText);


		// Deal with a rare bug where an OSM way has only one node
		for (var i in data.ways) {
			if (data.ways[i].nodes.length < 2) {
				delete data.ways[i];
				console.warn('Way ' + i + ' is a bug. It only has one node. Consider deleting it from OSM.');
			}
		}

		B.Logger.log('info', 'Returning OSM Data');
		B.Worker.sendMsg({
			action: 'loadOSMData',
			data: data
		});
	};
	B.Logger.log('info', 'Loading OSM Data');
	xhr.send(null);
});