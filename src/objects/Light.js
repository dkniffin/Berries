/*
 * B.Light represents a light source in the model
 */

B.Light = B.Class.extend({
	_position: null,
	options: {
	},
	initialize: function (position, options) {
		options = B.setOptions(this, options);

		this._position = position;
		
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

		var dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position = this._position;
		dirLight.target.position = new THREE.Vector3(4311, 1640, 7065);

		dirLight.castShadow = true;
		dirLight.shadowCameraVisible = true;


		dirLight.shadowMapWidth = 8192;
		dirLight.shadowMapHeight = 8192;

		var d = 10000;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraFar = 5000;
		dirLight.shadowBias = -0.0001;
		dirLight.shadowDarkness = 0.5;


		model.addObject(dirLight);


		return this;

	}
});

B.light = function (id, options) {
	return new B.Light(id, options);
};