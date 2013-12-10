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
	var i;


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
	var crossSection = new THREE.Shape(outlinePoints);

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


	var extrudespline = new THREE.SplineCurve3([
		new THREE.Vector3(0, 0, groundLevel),
		new THREE.Vector3(0, 0, roofLevel)
    ]);
	
	var steps = 2;

	var frames = {tangents: [], normals: [], binormals: []};
	var normal = new THREE.Vector3(1, 0, 0);
	for (i = 0; i < steps + 1; i++) {
		var u = i / steps;
		var tangent = extrudespline.getTangentAt(u).normalize();
		frames.tangents[i] = tangent;
		frames.normals[i] = normal;
		frames.binormals[i] = tangent.clone().cross(normal);
	}


	buildingGeometry = new THREE.ExtrudeGeometry(crossSection, {
		extrudePath: extrudespline,
		steps: steps,
		frames: frames,
		closed: true,
		extrudeMaterial: 0,
		material: 1
	});
	buildingGeometry.uvsNeedUpdate = true;

	
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

