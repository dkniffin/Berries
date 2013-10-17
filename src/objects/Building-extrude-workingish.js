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
		levelHeight: 3.048 // meters
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
		//outlinePoints.push(outlinePoints[0]);



		// Generate the building geometry
		var shapePoints = [];

		// TODO: Change this to use a centerpoint
		//var groundLevel = outlinePoints[0].y;
		//var groundLevel = 3000;
		//var roofLevel = groundLevel + height;

		var clockwise = this._isClockWise(outlinePoints);

		if (clockwise) {
			// Reverse CCW point sets
			outlinePoints.reverse();
		}

		for (var j in outlinePoints) {
			var point = outlinePoints[j];
			shapePoints.push(new THREE.Vector2(point.x, point.z));
		}

		this._geometry =  new THREE.ExtrudeGeometry(
			new THREE.Shape(shapePoints),
			{
				amount: height,
				//bevelEnabled: true, 
				//steps: 5
				//extrudeMaterial: 0, 
				//material: 1
			});
		this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

		//console.debug(roofGeometry);



		
		
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
	_isClockWise: function (points) {
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
