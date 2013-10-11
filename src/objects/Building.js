/*
 * B.Road is a class for drawing a road
 */

B.Building = B.Class.extend({

	_height: 0,
	_way: {},
	_nodes: {},
	options: {
		floors: 2,
		floorHeight: 3.048 // meters
	},
	initialize: function (way, nodes, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._nodes = nodes;

		// TODO: Base this on tags, if available
		this._height = this.options.floors * this.options.floorHeight;

	},
	addTo: function (model) {
		var outlinePoints = [];
		var vec;
		var lat, lon;
		for (var i in this._nodes) {
			lat = Number(this._nodes[i].lat);
			lon = Number(this._nodes[i].lon);
			vec = model.getTerrain().worldVector(lat, lon);
			vec.y += 1;
			outlinePoints.push(vec);
		}
		// Add the first point again, to make the object closed
		outlinePoints.push(outlinePoints[0]);

		/*
		var buildingOutline = new THREE.Shape(outlinePoints);

		
		// TODO: Change this to use a centerpoint
		var groundPoint = outlinePoints[0];
		var buildingTopPoint = new THREE.Vector3(groundPoint.x, groundPoint.y + this._height, groundPoint.z);

		var vertical = new THREE.SplineCurve3([groundPoint, buildingTopPoint]);

		var geometry = new THREE.ExtrudeGeometry(buildingOutline, {extrudePath: vertical });

		// TODO: Use textures
		var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color: 0xff0000
		}));
		model.addObject(mesh);
		*/
		
		
		var geometry = new THREE.Geometry();
		geometry.vertices = outlinePoints;

		var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
			color: 0xff0000
		}));

		model.addObject(line);
		
		return this;
	}
});

B.building = function (id, options) {
	return new B.Building(id, options);
};
