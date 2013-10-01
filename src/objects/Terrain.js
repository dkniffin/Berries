/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	_worldWidth: 100, // Must be even!
	_worldDepth: 100, // Must be even!
	_worldHalfWidth: 100, // Must be even!
	_worldHalfDepth: 100, // Must be even!
	_originXInMeters: 0,
	_originYInMeters: 0,

	options: {
		planeWidth: 7500,
		planeHeight: 7500,
		gridSpace: 100, // In meters
		dataType: 'SRTM_vector'

	},
	initialize: function (inData, options) {
		options = B.setOptions(this, options);

		// Read in the data
		this._data = this.addData(inData);

		// Set up the geometry
		this._geometry = new THREE.PlaneGeometry(options.planeWidth, options.planeHeight,
			this._worldWidth - 1, this._worldDepth - 1);
		this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		this._updateGeometry();

		
	},
	addTo: function (model) {
		var mesh = new THREE.Mesh(this._geometry, new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('lib/textures/seamless-dirt.jpg')
		}));
		model.addThreeGeometry(mesh);
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
	// This function takes "raw" SRTM data (in JSON format) and sets up the
	// variables based on that.
	_addSRTMData: function (inData) {
		var data = inData; // Save the data in a global variable

		// Update the world dimensions based on the data
		this._updateWorldDimensions(data.minLat, data.maxLat, data.minLon, data.maxLon);

		// Convert the lat and lon values to x and y values in meters, and store that in the data variable
		for (var i in data.nodes) {
			var xym = this._latlon2meters(data.nodes[i].lat, data.nodes[i].lon);
			data.nodes[i].xm = xym.x;
			data.nodes[i].ym = xym.y;
		}

		return data;
	},
	// Update the world dimensions
	_updateWorldDimensions: function (minLat, maxLat, minLon, maxLon) {
		var minInMeters = this._latlon2meters(minLat, minLon);
		var maxInMeters = this._latlon2meters(maxLat, maxLon);

		// The logic used below is: find the distance between max and min in
		// degrees, convert to meters, and divide by the spacing between grid
		// points, then round to the nearest 2, to get the number of grid points.
		this._worldWidth = this._customRound(
			(Math.abs(maxInMeters.x - minInMeters.x)) / this.options.gridSpace,
			'nearest',
			2
			);
		this._worldDepth = this._customRound(
			(Math.abs(maxInMeters.y - minInMeters.y)) / this.options.gridSpace,
			'nearest',
			2
			);
		this._worldHalfWidth = this._worldWidth / 2;
		this._worldHalfDepth = this._worldDepth / 2;

		this._originXInMeters = minInMeters.x;
		this._originYInMeters = minInMeters.y;
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
	_latlon2meters: function (lat, lon) {
		// Converts a lat,lon set to a x,y (in meters) set
		// TODO: Move this out of Terrain.js
		// TODO: Fix this. Lon doesn't convert that easily. This 
		// value is specific to locations at about 40 N or S
		return {
			x: lat * 111000,
			y: lon * 85000
		};
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
		var gridApproximationBoxes = new Array(this._worldWidth + 5);
		for (var a = 0; a < gridApproximationBoxes.length; a++) {
			gridApproximationBoxes[a] = new Array(this._worldDepth + 5);
			for (var b = 0; b < gridApproximationBoxes[a].length; b++) {
				gridApproximationBoxes[a][b] = [];
			}
		}

		// Sort each node into a box
		for (var ptIndex in inData) {
			// Set local variable for X and Y point coords
			var ptX = inData[ptIndex].xm;
			var ptY = inData[ptIndex].ym;

			// Find the containing box
			var gabX = this._customRound(
				ptX - this._originXInMeters,
				'down',
				this.options.gridSpace
				) / this.options.gridSpace;
			var gabY = this._customRound(
				ptY - this._originYInMeters,
				'down', this.options.gridSpace
				) / this.options.gridSpace;

			gridApproximationBoxes[gabX][gabY].push(ptIndex);

		}

		var Vindex = 0;
		var minXindex, minYindex, maxXindex, maxYindex;
		// Find the closest point to each vertex
		for (var i = 0; i < this._worldDepth; i++) {
			var iAbs = this._originYInMeters + i * this.options.gridSpace;
			for (var j = 0; j < this._worldWidth; j++) {
				var jAbs = this._originXInMeters + j * this.options.gridSpace;

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