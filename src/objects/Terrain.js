/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	_numWidthGridPts: 100, // Must be even!
	_numDepthGridPts: 100, // Must be even!
	_numWGPHalf: function () { return this._numWidthGridPts / 2; },
	_numDGPHalf: function () { return this._numDepthGridPts / 2; },
	_dataWidthInMeters: 100,
	_dataDepthInMeters: 100,
	_origin: new B.LatLng(0, 0), // The lat/lng coords of the origin of the terrain grid

	options: {
		gridSpace: 100, // In meters
		dataType: 'SRTM_vector'

	},
	initialize: function (inData, options) {
		options = B.setOptions(this, options);


		// Read in the data
		this._data = this.addData(inData);

		// Set up the geometry
		//this._geometry = new THREE.PlaneGeometry(options.planeWidth, options.planeHeight,
		this._geometry = new THREE.PlaneGeometry(this._dataWidthInMeters, this._dataDepthInMeters,
		//this._geometry = new THREE.PlaneGeometry(this._dataDepthInMeters, this._dataWidthInMeters,
			this._numWidthGridPts - 1, this._numDepthGridPts - 1);

		this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		
		THREE.GeometryUtils.triangulateQuads(this._geometry);
		//this._geometry.computeFaceNormals();
		//this._geometry.computeCentroids();

		this._updateGeometry();

		this._mesh.translateX(this._dataWidthInMeters / 2);
		this._mesh.translateZ(this._dataDepthInMeters / 2);

		
	},
	addTo: function (model) {
		model.addTerrain(this);
		return this;
	},
	addData: function (inData) {
		// TODO: incorporate "add" functionality, instead of "replace"
		// TODO: Add SRTM_raster
		switch (this.options.dataType) {
		case 'SRTM_vector':
			return this._addSRTMData(inData);
		default:
			throw new Error('Unsupported terrain data type');
		}
	},
	heightAt: function (lat, lon, model) {
		// Return the elevation of the terrain at the given lat/lon
		var ele;
		var xym = this._latlon2meters(lat, lon);
		//console.log('lat: ' + lat);
		//console.log('lon: ' + lon);
		//console.log(xym);
		//var ray = new THREE.Ray(new THREE.Vector3(xym.x, 10000, xym.y), new THREE.Vector3(0, 1, 0));


		var material = new THREE.LineBasicMaterial({
	        color: 0xff0000
	    });
	    var geometry = new THREE.Geometry();
	    //geometry.vertices.push(new THREE.Vector3(-3750, 2300, -3750));
	    //geometry.vertices.push(new THREE.Vector3(-3750, 0, -3750));
	    geometry.vertices.push(new THREE.Vector3(xym.x, 2300, xym.y));
	    geometry.vertices.push(new THREE.Vector3(xym.x, 0, xym.y));

	    //geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI));


		var line = new THREE.Line(geometry, material);

		model.addObject(line);
		console.log(line);

		console.log(this._geometry);


		var rc = new THREE.Raycaster();
		rc.set(new THREE.Vector3(xym.x, 2300, xym.y), new THREE.Vector3(0, -1, 0));

		console.log(this._mesh);

		var intersects = rc.intersectObject(this._mesh);
		console.log(intersects);


		return ele;
	},
	_latlon2meters: function (lat, lon) {
		// This function takes a lat/lon pair, and converts it to meters,
		// relative to the origin of the terrain, and returns x,y, and 
		// straightLine distances

		// normalize the input into a B.LatLng object
		var latlng = B.latLng(lat, lon);

		return {
			//x: latlng.distanceTo([latlng.lat, this._origin.lng]),
			//y: latlng.distanceTo([this._origin.lat, latlng.lng]),
			x: this._origin.distanceTo([latlng.lat, this._origin.lng]),
			y: this._origin.distanceTo([this._origin.lat, latlng.lng]),
			straightLine: latlng.distanceTo(this._origin)
		};
	},
	// This function takes "raw" SRTM data (in JSON format) and sets up the
	// variables based on that.
	_addSRTMData: function (inData) {
		var data = {
			nodes: []
		};


		//var data = inData; // Save the data in a global variable

		// Update the world dimensions based on the data
		this._updateWorldDimensions(inData.minLat, inData.maxLat, inData.minLon, inData.maxLon);


		// Create a LatLng object for each node, populate the elevation,
		// and create a xm and ym (meters relative to origin).
		for (var i in inData.nodes) {
			var latlng = new B.LatLng(inData.nodes[i].lat, inData.nodes[i].lon);
			var xym = this._latlon2meters(latlng);
			data.nodes.push({
				latlng: latlng,
				ele: inData.nodes[i].ele,
				//xm: latlng.distanceTo([latlng.lat, this._origin.lng]),
				//ym: latlng.distanceTo([this._origin.lat, latlng.lng])
				xm: xym.x,
				ym: xym.y
			});
		}

		//console.log(data);
		return data;
	},
	// Update the world dimensions
	_updateWorldDimensions: function (minLat, maxLat, minLon, maxLon) {
		var origin = this._origin = new B.LatLng(minLat, minLon);

		// The logic used below is: find the distance between max and min in
		// degrees, convert to meters, and divide by the spacing between grid
		// points, then round to the nearest 2, to get the number of grid points.
		var widthInMeters = this._dataWidthInMeters = origin.distanceTo([origin.lat, maxLon]);
		var depthInMeters = this._dataDepthInMeters = origin.distanceTo([maxLat, origin.lng]);

		this._numWidthGridPts = this._customRound(
			widthInMeters / this.options.gridSpace,
			'nearest', 2);

		this._numDepthGridPts = this._customRound(
			depthInMeters / this.options.gridSpace,
			'nearest', 2);

	},
	_customRound: function (value, mode, multiple) {
		// TODO: Move this out of Terrain.js
		// Rounds the value to the multiple, using the given mode
		// ie: round 5 up to a mupltiple of 10 (10)
		// or: round 36 down to a multiple of 5 (35)
		// or: round 44 to the nearest multiple of 3 (45)
		switch (mode) {
		case 'nearest':
			var nearest;
			if ((value % multiple) >= multiple / 2) {
				nearest = parseInt(value / multiple, 10) * multiple + multiple;
			} else {
				nearest = parseInt(value / multiple, 10) * multiple;
			}
			return nearest;
		case 'down':
			return (multiple * Math.floor(value / multiple));
		case 'up':
			return (multiple * Math.ceil(value / multiple));
		}
	},
	_updateGeometry: function () {
		var inData = this._data.nodes;
		var geo = this._geometry;
		// This function takes input data (inData) and fills it into a geometry (geo),
		// by setting the height of each vertex in the geometry

		// The algorithm used here is as follows: 

		// 1: Sort each input data point into a "grid approximation box";
		// basically round it to the nearest gridpoint.

		// 2: Loop over each vertex in the geometry, find the closest point to
		// that vertex. The way it does this is by first looking for points in the
		// grid- approximation-box for that vertex, and then searching each vertex
		// progressively farther out

		//3: Once it's found the closest data point, it sets the height of the
		//vertex to the height of that point.


		// Set up our boxes for organizing the points
		var gridApproximationBoxes = [];
		/*
		var gridApproximationBoxes = new Array(this._numWidthGridPts + 5);
		for (var a = 0; a < gridApproximationBoxes.length; a++) {
			gridApproximationBoxes[a] = new Array(this._numDepthGridPts + 5);
			for (var b = 0; b < gridApproximationBoxes[a].length; b++) {
				gridApproximationBoxes[a][b] = [];
			}
		}
		*/

		// Sort each node into a box
		for (var ptIndex in inData) {
			// Set local variable for X and Y point coords
			var ptX = inData[ptIndex].xm;
			var ptY = inData[ptIndex].ym;



			// Find the containing box
			var gabX = this._customRound(ptX, 'down', this.options.gridSpace) / this.options.gridSpace;
			var gabY = this._customRound(ptY, 'down', this.options.gridSpace) / this.options.gridSpace;
			if (!gridApproximationBoxes[gabX]) {
				gridApproximationBoxes[gabX] = [];
			}
			if (!gridApproximationBoxes[gabX][gabY]) {
				gridApproximationBoxes[gabX][gabY] = [];
			}

			gridApproximationBoxes[gabX][gabY].push(ptIndex);

		}

		var Vindex = 0;
		var minXindex, minYindex, maxXindex, maxYindex;
		// Find the closest point to each vertex
		for (var i = 0; i < this._numDepthGridPts; i++) {
			var iAbs = i * this.options.gridSpace;
			for (var j = 0; j < this._numWidthGridPts; j++) {
				var jAbs = j * this.options.gridSpace;

				var radius = 1;

				var points = [];

				// Find the possible closest points
				while (points.length === 0) {
					minXindex = j - (radius - 1);
					minYindex = i - (radius - 1);
					maxXindex = j + radius;
					maxYindex = i + radius;

					var nii; // The index of the Node index
					var ni; // Node index
					if (typeof gridApproximationBoxes[minXindex] !== 'undefined' &&
					typeof gridApproximationBoxes[minXindex][minYindex] !== 'undefined') {
						for (nii in gridApproximationBoxes[minXindex][minYindex]) {
							ni = gridApproximationBoxes[minXindex][minYindex][nii];
							points.push(inData[ni]);
						}

					}
					if (typeof gridApproximationBoxes[minXindex] !== 'undefined' &&
					typeof gridApproximationBoxes[minXindex][maxYindex] !== 'undefined') {
						for (nii in gridApproximationBoxes[minXindex][maxYindex]) {
							ni = gridApproximationBoxes[minXindex][maxYindex][nii];
							points.push(inData[ni]);
						}

					}
					if (typeof gridApproximationBoxes[maxXindex] !== 'undefined' &&
					typeof gridApproximationBoxes[maxXindex][minYindex] !== 'undefined') {
						for (nii in gridApproximationBoxes[maxXindex][minYindex]) {
							ni = gridApproximationBoxes[maxXindex][minYindex][nii];
							points.push(inData[ni]);
						}
					}
					if (typeof gridApproximationBoxes[maxXindex] !== 'undefined' &&
					typeof gridApproximationBoxes[maxXindex][maxYindex] !== 'undefined') {
						for (nii in gridApproximationBoxes[maxXindex][maxYindex]) {
							ni = gridApproximationBoxes[maxXindex][maxYindex][nii];
							points.push(inData[ni]);
						}
					}
					radius++;
				}
				    
				var closest = this._findClosestPoint(jAbs, iAbs, points);
				geo.vertices[Vindex].y = closest.z;
				Vindex++;
			}
		}

		this._mesh = new THREE.Mesh(this._geometry, new THREE.MeshBasicMaterial({
			//map: THREE.ImageUtils.loadTexture('lib/textures/seamless-dirt.jpg')
			color: 0x0000ff
		}));
	},
	_findClosestPoint: function (x, y, points) {
		// Find the closest point to x,y in the given set of points
		
		var closest = {
			i: 0,
			x: 0,
			y: 0,
			z: 0,
			d: 40075160 // Start with the circumference of the Earth
		};
		for (var k in points) {
			var d = this._distance(x, y, points[k].xm, points[k].ym);
			if (d < closest.d) {
				closest.i = k;
				closest.x = points[k].xm;
				closest.y = points[k].ym;
				closest.z = points[k].ele;
				closest.d = d;
			}
		}
		return closest;
	},
	_distance: function (x1, y1, x2, y2) {
		// Distance formula
		// TODO: Move this out of Terrain.js
		return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
	}

});

B.terrain = function (id, options) {
	return new B.Terrain(id, options);
};