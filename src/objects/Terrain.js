/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	options: {
		dataType: 'SRTM_raster'
	},
	initialize: function (data, bounds, options) {
		options = B.setOptions(this, options);

		// Read in the data
		this._data = data;
	
		this._bounds = bounds;
		this._origin = this._bounds.getSouthWest();

		var width = this._origin.distanceTo(this._bounds.getSouthEast());
		var height = this._origin.distanceTo(this._bounds.getNorthWest());

		// TODO: abstract the 199 and 399 out
		this._numGridsX = 199;
		this._numGridsY = 399;
		this._geometry = new THREE.PlaneGeometry(width, height, this._numGridsX, this._numGridsY);
		this._gridSpaceX = width / this._numGridsX;
		this._gridSpaceY = height / this._numGridsY;

		//this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		for (var i = 0, l = this._geometry.vertices.length; i < l; i++) {
			this._geometry.vertices[i].z = this._data[i] / 65535 * 4347;
		}
		THREE.GeometryUtils.triangulateQuads(this._geometry);
		this._geometry.computeFaceNormals();
		this._geometry.computeVertexNormals();


		this._createMesh();

		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;

		this._mesh.translateX(width / 2);
		this._mesh.translateY(height / 2);
	},
	heightAt: function (lat, lon, xym) {
		// Return the elevation of the terrain at the given lat/lon
		var ele; // The return value

		if (!this._bounds.contains([lat, lon])) {
			//throw new Error('Coordinates outside of bounds');
			console.error('Coordinates outside of bounds');
			return 0;
		}

		if (!xym) {
			xym = this._latlon2meters(lat, lon);
		}

		// Get the 
		var n = Math.ceil((xym.y) / this._gridSpaceY),
			s = Math.floor((xym.y) / this._gridSpaceY),
			e = Math.ceil((xym.x) / this._gridSpaceX),
			w = Math.floor((xym.x) / this._gridSpaceX);

		n = (n - 1 < 0) ? 0 : n - 1;
		s = (s - 1 < 0) ? 0 : s - 1;


		// Get the positions of the 4 data points
		var nwDP = (n) * this._numGridsX + w,
			neDP = (n) * this._numGridsX + e,
			seDP = (s) * this._numGridsX + e,
			swDP = (s) * this._numGridsX + w;

		// Get the vectors of the 4 surrounding points
		var nw = this._geometry.vertices[nwDP],
			ne = this._geometry.vertices[neDP],
			se = this._geometry.vertices[seDP],
			sw = this._geometry.vertices[swDP];

		// Simply estimate the value from an average of the four surrounding points
		//ele = (nw + ne + se + sw) / 4;

		// NOTE: This method wont work, because our mesh is comprised of triangles, not quads
		// http://math.stackexchange.com/questions/64176/interpolating-point-on-a-quad


		// Triangle interpolation
		// First figure out which triangle
		var dx = xym.x - sw.x,
			dy = xym.y - sw.y;
		var p1, p2, p3;
		if (dx < dy) {
			// Upper left triangle
		} else {
			// Lower right triangle
		}
		

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

		return ele;
	},
	_distance: function (x1, y1, x2, y2) {
		// Distance formula
		// TODO: Move this out of Terrain.js
		return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
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
