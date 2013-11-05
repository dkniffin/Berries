/*
 * B.Road is a class for drawing a road
 */

B.Road = B.Class.extend({

	_osmDC: null,
	_way: null,
	_geometry: null,
	options: {
		lanes: 2,
		laneWidth: 3.5 // meters
	},
	initialize: function (way, osmDC, model, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

		// Do some logic to determine appropriate road width.
		var width = this.options.lanes * this.options.laneWidth; // Default to input options
		if (this._way.tags) {
			var tags = this._way.tags;
			if (tags.width) {
				// If the width tag is defined, use that
				width = tags.width;
			} else {
				// Otherwise, base the calculation on lanes
				var numLanes = this.options.lanes; // Total for the whole road
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
				var laneWidth = this.options.laneWidth;
				// TODO: add logic to look for 'lane:widths' values
				
				// TODO: account for bicycle lanes, etc
				width = numLanes * laneWidth;

			}
		}

		// Create the cross section shape
		// Credits go to bai (http://bai.dev.supcrit.com/scripts/engine/things/road.js)
		/*
		var thickness = 0.25,
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
	    */
	    var thickness = 0.25;
		var roadpoints = [
			new THREE.Vector2(-width / 2, 0),
			new THREE.Vector2(-width / 2,  thickness),
			new THREE.Vector2(width / 2, thickness),
			new THREE.Vector2(width / 2, 0)
	    ];
	    var roadshape = new THREE.Shape(roadpoints);



	    var splinepoints = [];
	    // Create the road spline (the path it follows)
		for (var i in this._way.nodes) {
			i = Number(i);
			var nodeId = this._way.nodes[i];
			var node = this._osmDC.getNode(nodeId);
			var lat = Number(node.lat);
			var lon = Number(node.lon);
			var wvector = model.getTerrain().worldVector(lat, lon);

			// Make sure points aren't too close
			/*
			if (i !== 0 &&
				wvector.distanceTo(splinepoints[splinepoints.length - 1]) < 1) {
				continue;
			}
			*/

			wvector.z += thickness;



			splinepoints.push(wvector);
		}

		var roadspline;
		if (splinepoints[0].equals(splinepoints[splinepoints.length - 1])) {
			splinepoints.pop();
			roadspline = new THREE.ClosedSplineCurve3(splinepoints);
		} else {
			roadspline = new THREE.SplineCurve3(splinepoints);
		}

		/*var steps = Math.floor(roadspline.getLength() / 4);
		if (steps < 1) { steps = 1; }*/
		var steps = splinepoints.length;

		var frames = {tangents: [], normals: [], binormals: []};
		var normal = new THREE.Vector3(1, 0, 0);
		for (i = 0; i < steps + 1; i++) {
			var u = i / steps;
			var tangent = roadspline.getTangentAt(u).normalize();
			frames.tangents[i] = tangent;
			frames.normals[i] = normal;
			frames.binormals[i] = tangent.clone().cross(normal);
		}


		this._geometry = new THREE.ExtrudeGeometry(roadshape, {
			extrudePath: roadspline,
			steps: steps,
			frames: frames,
			closed: true
		});

	}
});

B.road = function (id, options) {
	return new B.Road(id, options);
};
