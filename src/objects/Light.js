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
		//dirLight.position = this._position;
		//dirLight.target.position = new THREE.Vector3(4311, 1640, 7065);

		dirLight.castShadow = true;
		dirLight.shadowCameraVisible = false;


		dirLight.shadowMapWidth = 4096;
		dirLight.shadowMapHeight = 4096;

		var d = 1000;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraFar = 500;
		dirLight.shadowCameraNear = -500;
		dirLight.shadowBias = 0.001;
		dirLight.shadowDarkness = 0.5;

		//this._position = position;
		
		return this;
	},
	addTo: function (model) {

/*
		var	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
		hemiLight.color.setHSL(0.6, 1, 0.6);
		hemiLight.groundColor.setHSL(0.095, 1, 0.75);
		hemiLight.position.set(0, 3000, 0);
		hemiLight.visible = true;
		model.addObject(hemiLight);
*/

		


		model.addObject(this._light);


		return this;

	}
});

B.light = function (id, options) {
	return new B.Light(id, options);
};