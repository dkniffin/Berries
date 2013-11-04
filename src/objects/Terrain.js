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
		this._numVertsX = 200;
		this._numVertsY = 400;
		this._geometry = new THREE.PlaneGeometry(width, height, this._numVertsX - 1, this._numVertsY - 1);
		this._gridSpaceX = width / (this._numVertsX - 1);
		this._gridSpaceY = height / (this._numVertsY - 1);

		// Set the heights of each vertex
		for (var i = 0, l = this._geometry.vertices.length; i < l; i++) {
			this._geometry.vertices[i].z = this._data[i] / 65535 * 4347;
		}
		//THREE.GeometryUtils.triangulateQuads(this._geometry);
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

		// Get the coords of the tile the point falls into (relative to top left)
		var ix = Math.floor((surfacePt.x) / this._gridSpaceX);
		var iy = (this._numVertsY - 2) - Math.floor((surfacePt.y) / this._gridSpaceY);

		// Get the positions of the 4 data points
		var nwDP = (this._numVertsX * iy) + ix,
			neDP = nwDP + 1,
			swDP = nwDP + this._numVertsX,
			seDP = swDP + 1;

		// Get the vectors of the 4 surrounding points
		var nw = this._copyVertexByValue(this._geometry.vertices[nwDP]),
			ne = this._copyVertexByValue(this._geometry.vertices[neDP]),
			se = this._copyVertexByValue(this._geometry.vertices[seDP]),
			sw = this._copyVertexByValue(this._geometry.vertices[swDP]);

		nw.x += this._mesh.position.x;
		ne.x += this._mesh.position.x;
		se.x += this._mesh.position.x;
		sw.x += this._mesh.position.x;

		nw.y += this._mesh.position.y;
		ne.y += this._mesh.position.y;
		se.y += this._mesh.position.y;
		sw.y += this._mesh.position.y;

		var px = ((surfacePt.x) / this._gridSpaceX) - Math.floor((surfacePt.x) / this._gridSpaceX);
		var py = ((surfacePt.y) / this._gridSpaceY) - Math.floor((surfacePt.y) / this._gridSpaceY);

		var lerp = this._lerp;
		// Calculate the elevation based on a linear interpolation between the surrounding points
		surfacePt.z = lerp(lerp(nw.z, se.z, (1 + px - py) / 2), px > (1 - py) ? ne.z : se.z, Math.abs(1 - px - py));
		

		return surfacePt.z;
	},
	_copyVertexByValue: function (vertex) {
		return new THREE.Vector3(
			vertex.x,
			vertex.y,
			vertex.z);
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
			map: texture
			// For debugging
			/*wireframe: true,
			color: 0x0000ff*/
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
