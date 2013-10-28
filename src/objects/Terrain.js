/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	options: {
		gridSpace: 50, // In meters
		dataType: 'SRTM_raster'
	},
	initialize: function (terrainDataPath, bounds, options) {
		options = B.setOptions(this, options);

		// Read in the data
		this._data = this._loadTerrain(terrainDataPath);

		this._bounds = bounds;
		this._origin = this._bounds.getSouthWest();

		var width = this._origin.distanceTo(this._bounds.getSouthEast());
		var height = this._origin.distanceTo(this._bounds.getNorthWest());

		this._geometry = new THREE.PlaneGeometry(width, height, 199, 399);



		//this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		for (var i = 0, l = this._geometry.vertices.length; i < l; i++) {
			this._geometry.vertices[i].z = this._data[i] / 65535 * 4347;
		}


		this._createMesh();

		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;



		this._mesh.translateX(width / 2);
		this._mesh.translateY(height / 2);



	},
	_loadTerrain: function (file) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'arraybuffer';
		xhr.open('GET', file, false);
		var data;
		xhr.onload = function () {
			if (xhr.response) {
				data = new Uint16Array(xhr.response);
			}
		};
		xhr.send(null);
		return data;
	},
	addTo: function (model) {
		model.addTerrain(this);
		//console.log(model);
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
