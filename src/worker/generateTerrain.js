B.Worker.addMsgHandler('generateTerrain', function (e) {
	/* Input:
	  - data
	  - options
	    - bounds
	    - numVertsX
	    - numVertsY
	*/
	var options = e.data.options;
	/* global terrain:true */
	terrain = {};

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'arraybuffer';
	xhr.open('GET', e.data.srtmDataSource, true);
	xhr.onload = function () {
		if (xhr.response) {
			var data = new Uint16Array(xhr.response);
			B.Logger.log('info', 'Getting SRTM data');

			var bounds = B.latLngBounds([[options.bounds[0].lat, options.bounds[0].lng],
										 [options.bounds[1].lat, options.bounds[1].lng]]);
			var numVertsX = options.numVertsX;
			var numVertsY = options.numVertsY;

			// Set the origin to the southwest corner of the bounds
			var origin = bounds.getSouthWest();

			// Calculate the width and height of the bounds
			var width = origin.distanceTo(bounds.getSouthEast());
			var height = origin.distanceTo(bounds.getNorthWest());

			// Create the geometry
			B.Logger.log('log', 'Creating the terrain geometry');
			var geometry = terrain.geometry = new THREE.PlaneGeometry(width, height, numVertsX - 1, numVertsY - 1);
			var gridSpaceX = width / (numVertsX - 1);
			var gridSpaceY = height / (numVertsY - 1);

			// Set the heights of each vertex
			B.Logger.log('debug', 'Populating vertices');
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
				geometry.vertices[i].z = data[i] / 65535 * 4347;
			}
			B.Logger.log('debug', 'Done populating vertices');
			//THREE.GeometryUtils.triangulateQuads(geometry);
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
				
			B.Logger.log('debug', 'Returning geometry...');
			B.Logger.log('debug', 'Sorry, this is gonna take a while...it needs to be refactored...');
			// TODO: This part takes a long time to run. At some point, it
			// should be probably rewritten so that the terrain is a
			// bufferGeometry
			B.Worker.sendMsg({
				action: 'generateTerrain',
				geometryParts: {
					vertices: geometry.vertices,
					faces: geometry.faces,
					width: width,
					height: height,
					numVertsX: numVertsX,
					numVertsY: numVertsY,
					gridSpaceX: gridSpaceX,
					gridSpaceY: gridSpaceY
				}
				// Other return values
			});

		}
	};
	xhr.send(null);
});
