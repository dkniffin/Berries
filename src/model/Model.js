/*
 * B.model is the equivalent of L.map. It initializes a model to add data to.
 */

B.Model = B.Class.extend({
	_clock: new THREE.Clock(),
	_loadManager: null,
	_camera: null,
	_origin: null,
	options: {
		initialCameraPos: new B.LatLng(39.97, -105.26),
		initialCameraLook: new B.LatLng(40.0, -105.26)
	},

	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._initContainer(id);

		this._initThree();
		this._initCamera();
		this._initLoadManager();

		// For debugging
		//this._addAxis('x', 1000000, 0xff0000);
		//this._addAxis('y', 1000000, 0x00ff00);
		//this._addAxis('z', 1000000, 0x0000ff);

		var light = new B.Light();
		light._light.position = new THREE.Vector3(0, 0, 0);
		light._light.target.position = new THREE.Vector3(-1, -1, -6000); // This should determine the sun angle

		//light.addTo(this);
		this._camera.add(light._light);

		this._scene.add(this._camera);

		return this;
		
	},
	addTerrain: function (terrain) {
		// Save the terrain reference locally
		this._terrain = terrain;

		// Update the origin
		this._origin = terrain._origin;

		// Update the camera position
		var xym = terrain._latlon2meters(this.options.initialCameraPos);
		this._camera.position = new THREE.Vector3(xym.x, xym.y, 3000);

		xym = terrain._latlon2meters(this.options.initialCameraLook);
		this._camera.lookAt(new THREE.Vector3(xym.x, xym.y, 1640));

		//this._camera.position = new THREE.Vector3(0, 0, 0);


		this._scene.add(terrain._mesh);
	},
	getTerrain: function () {
		return this._terrain;
	},
	addObject: function (object) {
		this._scene.add(object);
		return this;
	},
	_addAxis: function (axis, length, color) {
		var p1 = new THREE.Vector3(),
			p2 = new THREE.Vector3();
		switch (axis) {
		case 'x':
			p1.set(-length, 0, 0);
			p2.set(length, 0, 0);
			break;
		case 'y':
			p1.set(0, -length, 0);
			p2.set(0, length, 0);
			break;
		case 'z':
			p1.set(0, 0, -length);
			p2.set(0, 0, length);
			break;
		}
		var line,
			lineGeometry = new THREE.Geometry(),
			lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
		lineGeometry.vertices.push(p1, p2);
		line = new THREE.Line(lineGeometry, lineMat);
        this._scene.add(line);
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

		this._renderer.gammaInput = true;
		this._renderer.gammaOutput = true;
		//this._renderer.physicallyBasedShading = true;


		this._renderer.shadowMapEnabled = true;
		this._renderer.shadowMapSoft = true;
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
		var camera = this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 500000);
		camera.up.set(0, 0, 1);

		// Init the controls
		this._controls = new B.DefaultControl(camera);
	},
	_initLoadManager: function () {
		var manager = this._loadManager = new THREE.ColladaLoader();
		manager.onProgress = function (item, loaded, total) {
			console.log(item, loaded, total);
		};
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