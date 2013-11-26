B.Worker.addMsgHandler('generateTerrain', function (e) {
	/* Input:
	  - data
	  - options
	    - bounds
	    - numVertsX
	    - numVertsY
	*/
	var options = e.data.options;

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
			var geometry = new THREE.PlaneGeometry(width, height, numVertsX - 1, numVertsY - 1);
			var gridSpaceX = width / (numVertsX - 1);
			var gridSpaceY = height / (numVertsY - 1);

			// Set the heights of each vertex
			B.Logger.log('debug', 'Populating vertices');
			var verts = new Float32Array(geometry.vertices.length * 3);
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
				var vertex = geometry.vertices[i];
				vertex.z = data[i] / 65535 * 4347;

				verts[i * 3] = vertex.x;
				verts[i * 3 + 1] = vertex.y;
				verts[i * 3 + 2] = vertex.z;
			}
			//THREE.GeometryUtils.triangulateQuads(geometry);
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();

			B.Logger.log('debug', 'Reformatting faces');
			var faces = new Float32Array(geometry.faces.length * 3);
			for (var j = 0, k = geometry.faces.length; j < k; j++) {
				var face = geometry.faces[j];

				faces[j * 3] = face.a;
				faces[j * 3 + 1] = face.b;
				faces[j * 3 + 2] = face.c;
			}
				
			B.Logger.log('debug', 'Returning geometry...');
			//B.Logger.log('debug', 'Sorry, this is gonna take a while...it needs to be refactored...');
			// TODO: This part takes a long time to run. At some point, it
			// should be probably rewritten so that the terrain is a
			// bufferGeometry
			B.Worker.sendMsg({
				action: 'generateTerrain',
				geometryParts: {
					vertices: verts,
					faces: faces,
					width: width,
					height: height,
					numVertsX: numVertsX,
					numVertsY: numVertsY,
					gridSpaceX: gridSpaceX,
					gridSpaceY: gridSpaceY
				}
				// Other return values
			}, null, [
				verts.buffer,
				faces.buffer
			]);

		}
	};
	xhr.send(null);
});
