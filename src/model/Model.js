/*
 * B.model is the equivalent of L.map. It initializes a model and adds the features to it
 */

B.Model = B.Class.extend({
	_clock: new THREE.Clock(),
	_loadManager: null,
	_camera: null,
	_origin: null,
	_logger: null,
	_todo: 0,
	options: {
		// Logging options
		logContainer: document.body,
		logOptions: {},

		// three.js location (relative to the container with the worker js file)
		threeJS: null,

		// Camera options
		initialCameraPos: new B.LatLng(39.97, -105.26),
		initialCameraLook: new B.LatLng(40.0, -105.26),

		// Terrain options
		bounds: null,
		srtmDataSource: null,

		// OSM options
		osmDataSource: null,

		// Rendering options
		render: {
			fireHydrants: true,
			roads: {
				roadThickness: 0.25,
				lanes: 2,
				laneWidth: 3.5 // meters
			},
			buildings: {
				defaultBuildingMaterial: B.Materials.CONCRETEWHITE,
				heightOptions: {
					levels: 2,
					levelHeight: 3.048
				}
			}
			
		},
		modelContainer: document.body,
		texturePath: null
	},

	initialize: function (options) {
		options = B.setOptions(this, options);
		this._origin = options.bounds.getSouthWest();

		var logger = this._logger = new B.Logger(options.logContainer, options.logOptions);
		logger.log('Logger initialized');

		this._initContainer(options.modelContainer);

		logger.log('Initializing core THREE.js components');
		this._initThree();
		logger.log('Initializing camera');
		this._initCamera();

		// For debugging
		//logger.log('Adding XYZ axes');
		this._addAxis('x', 1000000, 0xff0000);
		this._addAxis('y', 1000000, 0x00ff00);
		this._addAxis('z', 1000000, 0x0000ff);

		// Add sunlight to the scene
		logger.log('Adding sunlight');
		var light = new B.Light();
		light._light.position = new THREE.Vector3(0, 0, 0);
		light._light.target.position = new THREE.Vector3(0, 0, -5); // This should determine the sun angle
		this._camera.add(light._light);
		this._camera.add(light._light.target);
		this._scene.add(this._camera);

		//var light2 = new THREE.AmbientLight(0x404040); // soft white light
		//this._scene.add(light2);

		B.Premades.load(logger);

		// Add three.js to the web worker
		B.Worker.sendMsg({
			action: 'loadLibrary',
			url: options.threeJS
		});
		/*
		B.Worker.sendMsg({
			action: 'loadDefaultMats'
		});
*/

		var model = this;
		var terrain = this._terrain = new B.Terrain(options.bounds);


		// Generate the terrain
		B.ToDoCounter++;
		B.Worker.sendMsg({
			action: 'generateTerrain',
			srtmDataSource: options.srtmDataSource,
			options: {
				numVertsX: 200,
				numVertsY: 400,
				bounds: [options.bounds._southWest, options.bounds._northEast]
			}
		}, function (e) {
			// When the terrain is finished being generated...

			// Build the mesh for it
			logger.log('Building terrain mesh');
			terrain.buildMesh(e.data.geometryParts);


			// Add it to the model
			logger.log('Adding terrain to the model');
			model.addTerrain(terrain);

			B.ToDoCounter--;
			// And start update/add process
			logger.log('Running terrain callbacks');
			terrain.runQueuedCallbacks();
			
		}.bind(this));


		// Load OSM Data
		B.ToDoCounter++;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', options.osmDataSource, true);
		xhr.onload = function () {
			var data = JSON.parse(xhr.responseText);

			// Deal with a rare bug where an OSM way has only one node
			for (var i in data.ways) {
				if (data.ways[i].nodes.length < 2) {
					delete data.ways[i];
					console.warn('Way ' + i + ' is a bug. It only has one node. Consider deleting it from OSM.');
				}
			}

			// Put the data in an OSMDataContainer
			var dc = new B.OSMDataContainer(data);

			// Add to the model; this runs a bunch of code that generates the
			// features and adds callbacks for them to be added to the model
			dc.addTo(model, options);
			B.ToDoCounter--;
		}.bind(this);
		logger.log('Loading OSM Data');
		xhr.send(null);


		// When everything's ready, start the animation sequence
		var func = function () {
			if (B.ToDoCounter === 0) {
				this._logger.log('starting animation');
				this._logger.hide();
				this._startAnimation();
			} else {
				setTimeout(func, 2000);
			}
		}.bind(this);
		func();


		return this;
		
	},
	addTerrain: function (terrain) {
		// Update the camera position
		var xym = terrain._latlon2meters(this.options.initialCameraPos);
		this._camera.position = new THREE.Vector3(xym.x, xym.y, 5000);

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
			p1.set(100000, -length, 2800);
			p2.set(100000, length, 2800);
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
			throw new Error('Model container not found.');
		} else if (container._berries) {
			throw new Error('Model container is already initialized.');
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
		
	},
	_render: function () {
		//this._controls.update(this._clock.getDelta()); // Update the controls based on a clock
		this._renderer.render(this._scene, this._camera); // render the scene
	},
	_startAnimation: function () {
		var self = this;
		console.log(self._scene);
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
