/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	options: {
		gridSpace: 50, // In meters
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

		this._geometry = new THREE.PlaneGeometry(width, height, 199, 399);

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

		var rc = new THREE.Raycaster(
			new THREE.Vector3(xym.x, xym.y, 5000),
			new THREE.Vector3(0, 0, -1)
			);
		
		ele = rc.intersectObject(this._mesh);
		console.log(ele);

		return ele;
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
