/*
 * B.Light represents a light source in the model
 */

B.Light = B.Class.extend({
	_position: null,
	_light: null,
	options: {
	},
	initialize: function (options) {
		options = B.setOptions(this, options);

		var dirLight = this._light = new THREE.DirectionalLight(0xffffff, 1);

		dirLight.castShadow = true;
		dirLight.shadowCameraVisible = false;


		dirLight.shadowMapWidth = 8192;
		dirLight.shadowMapHeight = 8192;

		var d = 10000;

		// This controls the size of the box for the camera
		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;
		dirLight.shadowCameraFar = 3000;
		dirLight.shadowCameraNear = -100;

		// This controls the position of the shadows. Tweaking it can remove
		// an effect known as a peter panning (separation between the shadow
		// and the object)
		//dirLight.shadowBias = 0.01; 
		
		dirLight.shadowDarkness = 0.5; // How dark are the shadows?
		
		return this;
	},
	addTo: function (model) {
		model.addObject(this._light);

		return this;

	}
});

B.light = function (id, options) {
	return new B.Light(id, options);
};
