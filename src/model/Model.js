/*
 * B.model is the equivalent of L.map. It initializes a model to add data to.
 */

B.Model = B.Class.extend({
	_clock: new THREE.Clock(),
	
	options: {
	},

	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._initContainer(id);

		this._initThree();
		this._initCamera();

		return this;
		
	},
	addTerrain: function (terrain) {
		this._terrain = terrain;

		
		this._scene.add(terrain._mesh);
	},
	getTerrain: function () {
		return this._terrain;
	},
	addObject: function (object) {
		this._scene.add(object);
		return this;
	},
	_initContainer: function (id) {
		var container = this._container = B.DomUtil.get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._berries) {
			throw new Error('Map container is already initialized.');
		}
		container._berries = true;
	},
	_initThree: function () {
		this._scene = this._scene = new THREE.Scene();

		// TODO: Add some logic to do canvas or WebGL (or maybe SVG?)
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(window.innerWidth, window.innerHeight);

		// Empty the rendering container
		this._container.innerHTML = '';

		// Append the renderer to the container
		this._container.appendChild(this._renderer.domElement);

	},
	_initCamera: function () {
		// Create the camera
		var camera = this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

		// First person controls
		//this._controls = new THREE.FirstPersonControls(camera);
		//this._controls.movementSpeed = 3000;
		//this._controls.lookSpeed = 0.1;

		// Position the camera
		camera.position.x = 2000;
		camera.position.y = 5000;
		camera.position.z = 7065;
		// Look at the center of campus
		camera.lookAt(new THREE.Vector3(4311, 1640, 7065));

	},
	_render: function () {
		//this._controls.update(this._clock.getDelta()); // Update the controls based on a clock
		this._renderer.render(this._scene, this._camera); // render the scene
	}

});

B.model = function (id, options) {
	if (!THREE) {
		throw new Error('three.js is not detected. Berries required three.js');
	}
	return new B.Model(id, options);
};