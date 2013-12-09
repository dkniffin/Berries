function roadWidth(tags, options) {
		// Do some logic to determine appropriate road width.
	var width = options.lanes * options.laneWidth; // Default to input options
	if (tags) {
		if (tags.width) {
			// If the width tag is defined, use that
			width = tags.width;
		} else {
			// Otherwise, base the calculation on lanes
			var numLanes = options.lanes; // Total for the whole road
			if (tags.lanes) {
				numLanes = tags.lanes;
			} else if (tags.highway) {
				switch (tags.highway) {
				case 'motorway':
				case 'trunk':
				case 'primary':
				case 'secondary':
					numLanes = 4;
					break;
				case 'tertiary':
				case 'residential':
					numLanes = 2;
					break;
				case 'service':
				case 'track':
					numLanes = 1;
					break;
				}
			}
			var laneWidth = options.laneWidth;
			// TODO: add logic to look for 'lane:widths' values
			
			// TODO: account for bicycle lanes, etc
			width = numLanes * laneWidth;

		}
	}
	return width;
}

B.Worker.addMsgHandler('generateRoad', function (e) {
	//B.Logger.log('debug', 'Generating Road');
	var oIn = e.data.origin;
	var origin = B.latLng(oIn.lat, oIn.lng);
	var nodes = e.data.nodes;
	var tags = e.data.tags;
	var options = e.data.options;

	var translation = {
		x: origin.distanceTo([origin.lat, nodes[0].lon]),
		y: origin.distanceTo([nodes[0].lat, origin.lng])
	};



	// Get the width of the road
	var width = roadWidth(tags, options);

	// Create the cross section shape
    var thickness = options.roadThickness;
	var crossSectionPoints = [
		new THREE.Vector2(-width / 2, 0),
		new THREE.Vector2(-width / 2,  thickness),
		new THREE.Vector2(width / 2, thickness),
		new THREE.Vector2(width / 2, 0)
    ];
    var crossSection = new THREE.Shape(crossSectionPoints);



    var splinePoints = [];
    // Create the road spline (the path it follows)
	for (var i in nodes) {
		// Convert the node points (lat/lon) to an array of Vector2
		splinePoints[i] = new THREE.Vector3(
			origin.distanceTo([origin.lat, nodes[i].lon]) - translation.x,
			origin.distanceTo([nodes[i].lat, origin.lng]) - translation.y,
			0
		);
	}

	//B.Logger.log('debug', splinePoints);
	var roadspline;
	if (splinePoints[0].equals(splinePoints[splinePoints.length - 1])) {
		splinePoints.pop();
		roadspline = new THREE.ClosedSplineCurve3(splinePoints);
	} else {
		roadspline = new THREE.SplineCurve3(splinePoints);
	}

	/*var steps = Math.floor(roadspline.getLength() / 4);
	if (steps < 1) { steps = 1; }*/
	var steps = splinePoints.length;

	var frames = {tangents: [], normals: [], binormals: []};
	var normal = new THREE.Vector3(1, 0, 0);
	for (i = 0; i < steps + 1; i++) {
		var u = i / steps;
		var tangent = roadspline.getTangentAt(u).normalize();
		frames.tangents[i] = tangent;
		frames.normals[i] = normal;
		frames.binormals[i] = tangent.clone().cross(normal);
	}


	//B.Logger.log('debug', 'Creating ExtrudeGeometry');
	var geometry = new THREE.ExtrudeGeometry(crossSection, {
		extrudePath: roadspline,
		steps: steps,
		frames: frames,
		closed: true,
		extrudeMaterial: 0
	});

	//B.Logger.log('debug', 'Sending geometry back');
	// Send back the deconstructed geometry
	var deconstructedGeo = B.WebWorkerGeometryHelper.deconstruct(geometry);
	B.Worker.sendMsg({
		action: 'generateRoad',
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

