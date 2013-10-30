/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	options: {
		dataType: 'SRTM_raster'
	},
	initialize: function (data, bounds, options) {
		// Data - an array of elevations
		// Bounds - the lat/lon bounds of the terrain
		options = B.setOptions(this, options);

		// Read in the data
		this._data = data;
		this._bounds = bounds;

		// Set the origin to the southwest corner
		this._origin = this._bounds.getSouthWest();

		// Calculate the width and height of the bounds
		var width = this._origin.distanceTo(this._bounds.getSouthEast());
		var height = this._origin.distanceTo(this._bounds.getNorthWest());

		// Create the geometry
		// TODO: abstract the 199 and 399 out
		this._numGridsX = 200;
		this._numGridsY = 400;
		this._geometry = new THREE.PlaneGeometry(width, height, this._numGridsX - 1, this._numGridsY - 1);
		this._gridSpaceX = width / this._numGridsX;
		this._gridSpaceY = height / this._numGridsY;

		// Set the heights of each vertex
		for (var i = 0, l = this._geometry.vertices.length; i < l; i++) {
			this._geometry.vertices[i].z = this._data[i] / 65535 * 4347;
		}
		THREE.GeometryUtils.triangulateQuads(this._geometry);
		this._geometry.computeFaceNormals();
		this._geometry.computeVertexNormals();

		// Create the mesh
		this._createMesh();

		// Enable shadows for the ground
		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;

		// Move the mesh so that the origin is in the southwest corner
		this._mesh.translateX(width / 2);
		this._mesh.translateY(height / 2);
	},
	heightAt: function (lat, lon, xym) {
		// Return the elevation of the terrain at the given lat/lon
		var surfacePt = new THREE.Vector3();

		if (!this._bounds.contains([lat, lon])) {
			//throw new Error('Coordinates outside of bounds');
			console.error('Coordinates outside of bounds');
			return 0;
		}

		if (!xym) {
			xym = this._latlon2meters(lat, lon);
		}

		surfacePt.x = xym.x;
		surfacePt.y = xym.y;

		var nRow = Math.ceil((surfacePt.y) / this._gridSpaceY), // 0 based
			sRow = Math.floor((surfacePt.y) / this._gridSpaceY),// 0 based
			wCol = Math.ceil((surfacePt.x) / this._gridSpaceX), // 0 based
			eCol = Math.floor((surfacePt.x) / this._gridSpaceX); // 0 based

		// Get the positions of the 4 data points
		var nwDP = (nRow) * this._numGridsX + wCol,
			neDP = (nRow) * this._numGridsX + eCol,
			seDP = (sRow) * this._numGridsX + eCol,
			swDP = (sRow) * this._numGridsX + wCol;

		// Get the vectors of the 4 surrounding points
		var nw = this._geometry.vertices[nwDP],
			ne = this._geometry.vertices[neDP],
			se = this._geometry.vertices[seDP],
			sw = this._geometry.vertices[swDP];


		// NOTE: Quad interpolation wont work, because our mesh is comprised of triangles, not quads
		// http://math.stackexchange.com/questions/64176/interpolating-point-on-a-quad
		

		// Triangle interpolation
		// First figure out which triangle
		var dx = xym.x - sw.x,
			dy = xym.y - sw.y;
		var p1, p2, p3;
		
		if (dx < dy) {
			// Upper left triangle
			p1 = ne;
			p2 = nw;
			p3 = sw;
		} else {
			// Lower right triangle
			p1 = sw;
			p2 = se;
			p3 = ne;
		}

		// TODO: abstract out this._distance(p1, p2) so we only run it once
		var d1 = this._distance(p1, new THREE.Vector3(surfacePt.x, p1.y, null));
		var d2 = (d1 * this._distance(p1, p3)) / this._distance(p1, p2);
		var d3 = (d1 * this._distance(p2, p3)) / this._distance(p1, p2);
		
		var a = this._lerp(p1.z, p2.z, d1);
		var b = this._lerp(p1.z, p3.z, d2);

		surfacePt.z = this._lerp(a, b, d3);
		
		// Simply estimate the value from an average of the four surrounding points
		//ele = (nw + ne + se + sw) / 4;

		//console.log(ele);

		// Attempt at raycasting
		/*
		var rc = new THREE.Raycaster(
			new THREE.Vector3(xym.x, xym.y, 5000),
			new THREE.Vector3(0, 0, -1)
			);
		
		ele = rc.intersectObject(this._mesh);
		console.log(ele);
		*/

		return surfacePt.z;
	},
	_distance: function (p1, p2) {
		// Distance formula
		// TODO: Move this out of Terrain.js
		return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
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
	_lerp: function (v1, v2, f) {
		return v1 + (v2 - v1) * f;
	},
	worldVector: function (lat, lon) {
		// Return a Vector3 with world coords for given lat, lon
		var xym = this._latlon2meters(lat, lon);

		var ele = this.heightAt(lat, lon, xym);

		return new THREE.Vector3(xym.x, xym.y, ele);
	},
	addTo: function (model) {
		model.addTerrain(this);
		console.log(model);
		return this;
	},
	_createMesh: function () {
		var texture = THREE.ImageUtils.loadTexture(B.Util.getTexturePath() + '/seamless-grass.jpg');
		var widthOfTexture = 10; // meters
		var heightOfTexture = 10; // meters
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(Math.round(this._dataDepthInMeters / heightOfTexture),
				Math.round(this._dataWidthInMeters / widthOfTexture));
		this._mesh = new THREE.Mesh(this._geometry, new THREE.MeshPhongMaterial({
			//map: texture
			wireframe: true,
			color: 0x0000ff
		}));
	},
	_latlon2meters: function (lat, lon) {
		// This function takes a lat/lon pair, and converts it to meters,
		// relative to the origin of the terrain, and returns x,y, and 
		// straightLine distances

		// normalize the input into a B.LatLng object
		var latlng = B.latLng(lat, lon);

		return {
			x: this._origin.distanceTo([this._origin.lat, latlng.lng]),
			y: this._origin.distanceTo([latlng.lat, this._origin.lng]),
			straightLine: latlng.distanceTo(this._origin)
		};
	}

});

B.terrain = function (id, options) {
	return new B.Terrain(id, options);
};
