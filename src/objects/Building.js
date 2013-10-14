/*
 * B.Road is a class for drawing a road
 */

B.Building = B.Class.extend({

	_height: 0,
	_way: {},
	_nodes: {},
	_osmDC: null,
	options: {
		floors: 2,
		floorHeight: 3.048 // meters
	},
	initialize: function (way, osmDC, model, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

		// TODO: Base this on tags, if available
		this._height = this.options.floors * this.options.floorHeight;


		var outlinePoints = [];
		var vec;
		var lat, lon;
		for (var i in this._way.nodes) {
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

		// TODO: Change this to use a centerpoint
		var groundLevel = outlinePoints[0].y;
		//var groundLevel = 3000;
		var roofLevel = groundLevel + this._height;

		// First, the walls
		for (var j in outlinePoints) {
			var point = outlinePoints[j];
			var point2i = (j !== (outlinePoints.length - 1)) ? j++ : 0;
			var point2 = outlinePoints[point2i];

			var wallGeometry = new THREE.Geometry();
			wallGeometry.vertices.push(new THREE.Vector3(point.x, groundLevel, point.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, groundLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, roofLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point.x, roofLevel, point.z));

			wallGeometry.faces.push(new THREE.Face3(0, 1, 2));
			wallGeometry.faces.push(new THREE.Face3(0, 2, 3));



			THREE.GeometryUtils.merge(buildingGeometry, wallGeometry);
		}

		buildingGeometry.computeCentroids();
		buildingGeometry.computeBoundingSphere();
		buildingGeometry.computeFaceNormals();


		// TODO: Change this to use a centerpoint
		/*
		var buildingOutline = new THREE.Shape(outlinePoints);

		var groundPoint = outlinePoints[0];
		var buildingTopPoint = new THREE.Vector3(groundPoint.x, groundPoint.y + 50, groundPoint.z);

		var vertical = new THREE.SplineCurve3([groundPoint, buildingTopPoint]);

		var geometry = new THREE.ExtrudeGeometry(buildingOutline, {extrudePath: vertical });

		

		// TODO: Use textures
		var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color: 0xff0000
		}));
		model.addObject(mesh);

		*/
		
		
		
		
		// Outline
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
