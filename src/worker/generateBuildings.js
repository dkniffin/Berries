var getHeight = function (tags) {
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
	var height = this.options.levels * this.options.levelHeight; // Default to input options
	if (tags) {
		if (tags.height) {
			// If the height tag is defined, use it
			// TODO: Check for various values (not meters)
			height = tags.height;
		} else {
			// Otherwise use levels for calculation
			var levels = this.options.levels;
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

			var levelHeight = this.options.levelHeight;

			height = levels * levelHeight;
		}
	}
	return height;
};

var getWallMaterialIndex = function (tags, default) {
	/* 
	Determine what material (or material index) should be used for the 
	walls of the building
	*/
	// TODO: Test this. building:material has been added to the CC
	var mat;
	
	switch (tags['building:material']) {
	case 'glass':
		mat = B.Materials.GLASSBLUE;
		break;
	case 'wood':
		mat = B.Materials.WOODBROWN;
		break;
	case 'brick':
		mat = B.Materials.BRICKRED;
		break;
	case 'concrete':
		mat = B.Materials.CONCRETEWHITE;
		break;
	default:
		mat = default;
		break;
	}
	
	return mat;
};

B.Worker.addMsgHandler('generateBuildings', function (e) {
	var options = e.data.options;
	B.Logger.log('info', 'Generating Buildings');

	// Get the buildings
	var buildings = B.OSMData.get('buildings');
	B.Logger.log('info', buildings);

	// Create an array to put the finished geometries in
	var buildingGeometries = [];

	// Foreach building, get the list of 
	for(var building in buildings) {
		/* Generate the building geometry

			Algorithm:
			1. create the wall faces
			2. create the roof face

            TODO: Look into whether extrudeGeometry is more efficient. The
			reason I decided against it here is that I had trouble getting 
			it to work correctly.
			*/
			/*
		var tags = building.tags;
		var nodes = building.nodes;

		var buildingGeometry =  new THREE.Geometry();
		var i, j;

		// Some logic to determine the height of the building
		var height = getHeight(tags);
		

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
		*/
	}
});