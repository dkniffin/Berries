/*
 * B.Road is a class for drawing a road
 */

B.Road = B.Class.extend({

	_osmDC: null,
	options: {
		lanes: 2,
		laneWidth: 10 // meters
	},
	initialize: function (way, osmDC, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

	},
	addTo: function (model) {
		// Create the cross section shape
		// Credits go to bai (http://bai.dev.supcrit.com/scripts/engine/things/road.js)
		var thickness = 0.25,
	        width = this.options.lanes * this.options.laneWidth,
	        thickscale = 4;
	    var roadpoints = [
			new THREE.Vector2(-1, 0),
			new THREE.Vector2(-1, -width / 2 - thickness * thickscale + 5),
			new THREE.Vector2(-1, -width / 2 - thickness * thickscale),
			new THREE.Vector2(0.1, -width / 2 - thickness * thickscale + 0.1),
			new THREE.Vector2(thickness * 0.75, -width / 2),
			new THREE.Vector2(thickness, -width / 2 + thickness * thickscale),
			new THREE.Vector2(thickness, width / 2 - thickness * thickscale),
			new THREE.Vector2(thickness * 0.75, width / 2),
			new THREE.Vector2(0.1, width / 2 + thickness * thickscale - 0.1),
			new THREE.Vector2(-1, width / 2 + thickness * thickscale),
			new THREE.Vector2(-1, width / 2 + thickness * thickscale - 5),
			new THREE.Vector2(-1, 0),
	    ];
	    var roadshape = new THREE.Shape(roadpoints);
	    //roadshape.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));


	    var splinepoints = [];
	    // Create the road spline (the path it follows)
		for (var i in this._way.nodes) {
			var nodeId = this._way.nodes[i];
			var node = this._osmDC.getNode(nodeId);
			var lat = Number(node.lat);
			var lon = Number(node.lon);
			var wvector = model.getTerrain().worldVector(lat, lon);

			wvector.y += thickness; // Add a meter, so it shows up above the surface

			splinepoints.push(wvector);
		}
		var roadspline = new THREE.SplineCurve3(splinepoints);

		var geometry = new THREE.ExtrudeGeometry(roadshape, {extrudePath: roadspline });

		var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color: 0x959393
		}));
		model.addObject(mesh);
		return this;
	}
});

B.road = function (id, options) {
	return new B.Road(id, options);
};
