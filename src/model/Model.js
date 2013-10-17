/*
 * B.model is the equivalent of L.map. It initializes a model to add data to.
 */

B.Model = B.Class.extend({
	_clock: new THREE.Clock(),
	_camera: null,
	_objects: {
		roads: [],
		buildings: []
	},
	options: {
	},

	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._initContainer(id);

		this._initThree();
		this._initCamera();

		var lightPos = new THREE.Vector3(2000, 5000, 7065);

		new B.Light(lightPos).addTo(this);

		return this;
		
	},
	addTerrain: function (terrain) {
		this._terrain = terrain;

		
		this._scene.add(terrain._mesh);
	},
	getTerrain: function () {
		return this._terrain;
	},
	addRoad: function (road) {
		this._objects.roads.push(road);
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

		//this._renderer.gammaInput = true;
		//this._renderer.gammaOutput = true;
		this._renderer.physicallyBasedShading = true;


		this._renderer.shadowMapEnabled = true;
		//this._renderer.shadowCameraNear = 3;
		//this._renderer.shadowCameraFar = 20000;
		//this._renderer.shadowCameraFov = 50;
		//this._renderer.shadowMapCullFace = THREE.CullFaceBack;

		// Empty the rendering container
		this._container.innerHTML = '';

		// Append the renderer to the container
		this._container.appendChild(this._renderer.domElement);

	},
	_initCamera: function () {
		// Create the camera
		var camera = this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

		// Position the camera
		// TODO: Make this an option or something
		camera.position.x = 2000;
		camera.position.y = 5000;
		camera.position.z = 7065;
		// Look at the center of campus
		camera.lookAt(new THREE.Vector3(4311, 1640, 7065));

		// First person controls
		//this._controls = new THREE.FirstPersonControls(camera);
		//this._controls.movementSpeed = 3000;
		//this._controls.lookSpeed = 0.1;

		this._controls = new B.DefaultControl(camera);


	},
	_render: function () {
		//this._controls.update(this._clock.getDelta()); // Update the controls based on a clock
		this._renderer.render(this._scene, this._camera); // render the scene
	},
	_startAnimation: function () {
		var self = this;
		var animateFunc = function () {
			window.requestAnimationFrame(animateFunc);
			self._renderer.render(self._scene, self._camera);
		};

		animateFunc();
	}
});

B.model = function (id, options) {
	if (!THREE) {
		throw new Error('three.js is not detected. Berries required three.js');
	}
	return new B.Model(id, options);
};