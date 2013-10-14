/*
 * B.Road is a class for drawing a road
 */

B.Building = B.Class.extend({

	_height: 0,
	_way: {},
	_nodes: {},
	_osmDC: null,
	options: {
		levels: 2,
		levelHeight: 3.048 // meters (~10ft)
	},
	initialize: function (way, osmDC, model, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

		// Some logic to determine the height of the building
		var height = this._height = this.options.levels * this.options.levelHeight; // Default to input options
		if (this._way.tags) {
			var tags = this._way.tags;
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
					case 'house':
					case 'garage':
					case 'roof': // TODO: Might want to handle this one separately
					case 'hut':
						levels = 1;
						break;
					}
				}

				var levelHeight = this.options.levelHeight;

				height = levels * levelHeight;
			}
		}
	


		// TODO: Use min_height

		var outlinePoints = [];
		var vec;
		var lat, lon;
		var i;
		for (i in this._way.nodes) {
			var nodeId = this._way.nodes[i];

			var node = this._osmDC.getNode(nodeId);

			lat = Number(node.lat);
			lon = Number(node.lon);
			vec = model.getTerrain().worldVector(lat, lon);
			vec.y += 1;
			outlinePoints.push(vec);
		}
		// Add the first point again, to make the object closed
		outlinePoints.push(outlinePoints[0]);



		// Generate the building geometry
		var buildingGeometry = this._geometry =  new THREE.Geometry();
		var roofPointsCoplanar = [];

		// TODO: Change this to use a centerpoint
		var groundLevel = outlinePoints[0].y;
		//var groundLevel = 3000;
		var roofLevel = groundLevel + height;

		var clockwise = this._isClockwise(outlinePoints);

		// First, the walls
		for (var j in outlinePoints) {
			j = Number(j);
			var point = outlinePoints[j];
			var point2i = (j !== (outlinePoints.length - 1)) ? j + 1 : 0;
			var point2 = outlinePoints[point2i];

			var wallGeometry = new THREE.Geometry();
			wallGeometry.vertices.push(new THREE.Vector3(point.x, groundLevel, point.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, groundLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, roofLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point.x, roofLevel, point.z));

			if (clockwise) {
				wallGeometry.faces.push(new THREE.Face3(2, 1, 0));
				wallGeometry.faces.push(new THREE.Face3(3, 2, 0));
			} else {
				wallGeometry.faces.push(new THREE.Face3(0, 1, 2));
				wallGeometry.faces.push(new THREE.Face3(0, 2, 3));
			}


			THREE.GeometryUtils.merge(buildingGeometry, wallGeometry);


			// create a point for the roof
			roofPointsCoplanar.push(new THREE.Vector3(point.x, roofLevel, point.z));
		}


		// Then the roof
		var roofGeometry = new THREE.Geometry();
		var roofShape = new THREE.Shape(roofPointsCoplanar);

		var shapePoints = roofShape.extractPoints();

		var faces = THREE.Shape.Utils.triangulateShape(shapePoints.shape, shapePoints.holes);

		for (i = 0; i < shapePoints.shape.length; i++) {
			roofGeometry.vertices.push(new THREE.Vector3(shapePoints.shape[i].x, 0, shapePoints.shape[i].y));
		}
		for (i = 0; i < faces.length ; i++) {
			var a = faces[i][2], b = faces[i][1], c = faces[i][0];
			var v1 = shapePoints.shape[a], v2 = shapePoints.shape[b], v3 = shapePoints.shape[c];

			roofGeometry.faces.push(new THREE.Face3(a, b, c));
			roofGeometry.faceVertexUvs[0].push(
			[new THREE.UV(v1.x, v1.y), new THREE.UV(v2.x, v2.y), new THREE.UV(v3.x, v3.y)]);
		}



		THREE.GeometryUtils.merge(buildingGeometry, roofGeometry);

		console.debug(roofGeometry);



		buildingGeometry.computeFaceNormals();
		
		// Outline
		/*
		var geometry = new THREE.Geometry();
		geometry.vertices = outlinePoints;

		var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
			color: 0xff0000
		}));

		model.addObject(line);
		*/
		return this;

	},

	_isClockwise: function (points) {
		var total = 0;
		for (var i in points) {
			i = Number(i);
			var p1 = points[i];
			var p2i = (i !== (points.length - 1)) ? i + 1 : 0;
			var p2 = points[p2i];

			total += (p2.x - p1.x) * (p2.y + p1.y);
		}

		if (total > 0) {
			return true;
		} else if (total < 0) {
			return false;
		} else {
			return 'meh';
		}
	}
});

B.building = function (id, options) {
	return new B.Building(id, options);
};
