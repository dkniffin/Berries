/*
 * B.Light represents a light source in the model
 */

B.Light = B.Class.extend({
	options: {
	},
	initialize: function (lat, lon, ele, options) {
		options = B.setOptions(this, options);

		this._lat = lat;
		this._lon = lon;
		this._ele = ele;
		
		return this;
	},
	addTo: function (model) {
		
		var m = this._latlon2meters(this._lat, this._lon);
		var x = m.x,
			z = m.y,
			y = this._ele;


		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(x, y, z).normalize();

		model.addObject(directionalLight);
		return this;
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
});

B.light = function (id, options) {
	return new B.Light(id, options);
};