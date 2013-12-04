function getHeight(tags, options) {
	/* Return the height of the building

	   In descending order of preference:
	   - height=* tag
	   - levels * levelheight calculation
	    - levels based on:
	     - levels=* tag
	     - building=* tags (building type)
	     - options.levels
	    - levelheight based on:
	     - options.levelHeight
	*/
	var height = options.levels * options.levelHeight; // Default to input options
	if (tags) {
		if (tags.height) {
			// If the height tag is defined, use it
			// TODO: Check for various values (not meters)
			height = tags.height;
		} else {
			// Otherwise use levels for calculation
			var levels = options.levels;
			if (tags['building:levels']) {
				levels = tags['building:levels'];
			} else if (tags.building) {
				switch (tags.building) {
				case 'house':
				case 'garage':
				case 'roof': // TODO: Handle this separately
				case 'hut':
					levels = 1;
					break;
				case 'school':
					levels = 2;
					break;
				case 'apartments':
				case 'office':
					levels = 3;
					break;
				case 'hospital':
					levels = 4;
					break;
				case 'hotel':
					levels = 10;
					break;
				}
			}

			var levelHeight = options.levelHeight;

			height = levels * levelHeight;
		}
	}
	return height;
}

B.Worker.addMsgHandler('generateBuilding', function (e) {
	//B.Logger.log('debug', 'Generating Building');

	// Inputs
	var oIn = e.data.origin;
	var origin = B.latLng(oIn.lat, oIn.lng);
	var nodes = e.data.nodes;
	var tags = e.data.tags;
	var options = e.data.options;

	var buildingGeometry =  new THREE.Geometry();
	var i, j;


	var translation = {
		x: origin.distanceTo([origin.lat, nodes[0].lon]),
		y: origin.distanceTo([nodes[0].lat, origin.lng])
	};
	// Convert the node points (lat/lon) to an array of Vector2
	var outlinePoints = [];
	for (i in nodes) {
		outlinePoints[i] = new THREE.Vector2(
			origin.distanceTo([origin.lat, nodes[i].lon]) - translation.x,
			origin.distanceTo([nodes[i].lat, origin.lng]) - translation.y
		);
	}

	// Determine if the nodes are defined in a clockwise direction or CCW
	var clockwise = THREE.Shape.Utils.isClockWise(outlinePoints);

	if (!clockwise) {
		// Reverse CCW point sets
		outlinePoints.reverse();
	}

	//B.Logger.log('debug', 'outlinePoints: ' + outlinePoints.length);


	// Some logic to determine the height of the building
	var height = getHeight(tags, options.heightOptions);

	// Use 0; the position in the model will be used later to place the object
	// on the ground
	var groundLevel = 0;
	
	var roofLevel = groundLevel + height;



	var roofPointsCoplanar = [];
	for (j in outlinePoints) {
		j = Number(j);
		var point = outlinePoints[j];
		var point2i = (j !== (outlinePoints.length - 1)) ? j + 1 : 0;
		var point2 = outlinePoints[point2i];

		// Create the geometry for one wall
		var wallGeometry = new THREE.Geometry();
		wallGeometry.vertices.push(new THREE.Vector3(point.x, point.y, groundLevel));
		wallGeometry.vertices.push(new THREE.Vector3(point2.x, point2.y, groundLevel));
		wallGeometry.vertices.push(new THREE.Vector3(point2.x, point2.y, roofLevel));
		wallGeometry.vertices.push(new THREE.Vector3(point.x, point.y, roofLevel));

		wallGeometry.faces.push(new THREE.Face3(2, 1, 0, null, null, 0));
		wallGeometry.faces.push(new THREE.Face3(3, 2, 0, null, null, 0));

		// Append it to the rest of the building geometry
		THREE.GeometryUtils.merge(buildingGeometry, wallGeometry);

		// create a 2D point for creating the roof
		roofPointsCoplanar.push(new THREE.Vector2(point.x, point.y));
	}


	// Create the geometry for the roof
	var roofGeometry = new THREE.Geometry();
	var roofShape = new THREE.Shape(roofPointsCoplanar);

	var shapePoints = roofShape.extractPoints();
	var faces = THREE.Shape.Utils.triangulateShape(shapePoints.shape, shapePoints.holes);

	for (i in shapePoints.shape) {
		var vertex = shapePoints.shape[i];
		roofGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, roofLevel));
	}
	for (i in faces) {
		roofGeometry.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2],
			null, null, 1));
	}

	roofGeometry.computeFaceNormals();
	THREE.GeometryUtils.merge(buildingGeometry, roofGeometry);
	
	buildingGeometry.computeFaceNormals();

	
	var deconstructedGeo = B.WebWorkerGeometryHelper.deconstruct(buildingGeometry);


	B.Worker.sendMsg({
		action: 'generateBuilding',
		tags: tags,
		geometryParts: {
			vertices: deconstructedGeo.verts,
			faces: deconstructedGeo.faces,
			materials: deconstructedGeo.mats,
			position: translation
		}
	}, null, [
		deconstructedGeo.verts.buffer,
		deconstructedGeo.faces.buffer,
		deconstructedGeo.mats.buffer
	]);
});

