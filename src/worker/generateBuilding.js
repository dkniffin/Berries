

B.Worker.addMsgHandler('generateBuilding', function () {
	//B.Logger.log('debug', 'Got to generateBuilding');
	/*
	B.Logger.log('info', 'Generating Building');
	var options = e.data.options;
	B.Logger.log('info', options);
	var tags = e.data.tags;
	var outlinePoints = e.data.outlinePoints;

	var buildingGeometry =  new THREE.Geometry();
	var i, j;

	// Some logic to determine the height of the building
	var height = getHeight(tags, options.heightOptions);
	

	// Use the lowest point of the building
	var groundLevel = outlinePoints[0].z;
	for (i in outlinePoints) {
		if (outlinePoints[i].z < groundLevel) {
			groundLevel = outlinePoints[i].z;
		}
	}
	var roofLevel = groundLevel + height;

	// Determine if the nodes are defined in a clockwise direction or CCW
	var clockwise = THREE.Shape.Utils.isClockWise(outlinePoints);

	if (!clockwise) {
		// Reverse CCW point sets
		outlinePoints.reverse();
	}

	var wallMaterialIndex = getWallMaterialIndex(tags, options.defaultBuildingMaterial);

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

		wallGeometry.faces.push(new THREE.Face3(2, 1, 0, null, null, wallMaterialIndex));
		wallGeometry.faces.push(new THREE.Face3(3, 2, 0, null, null, wallMaterialIndex));

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
			null, null, B.Materials.ASPHALTGREY));
	}

	roofGeometry.computeFaceNormals();
	THREE.GeometryUtils.merge(buildingGeometry, roofGeometry);
	
	buildingGeometry.computeFaceNormals();

	B.Logger.log('debug', buildingGeometry);
	*/
	var i = 0;
	while (i < 1) {
		i++;
	}
	B.Worker.sendMsg({
		action: 'generateBuilding'
	});
});