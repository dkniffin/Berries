B.DefaultControl = B.Class.extend({

	_enabled: true,
	_camera: {},
	_domElement: document,

	_STATE: {NONE: -1, ZOOMUP: 0, ZOOMDOWN: 1, ZOOMINMAX: 2, ZOOMOUTMAX: 3,
		PANNORTH: 4, PANSOUTH: 5, PANEAST: 6, PANWEST: 7, PITCHUP: 8,
		PITCHDOWN: 9, ROTATECW: 10, ROTATECCW: 11 },
	_state: -1, // Current state
	_prevState: -1, // Previous state

	options: {
		minCamHeight: 0,
		maxCamHeight: Infinity,
		keys: [33, 34, 35, 36, 38, 40, 39, 37, 38, 40, 39, 37],
		zoomIncrement: 10,
		panIncrement: 50,
		pitchIncrement: 0.1,
		maxZoomInHeight: 1600,
		maxZoomOutHeight: 10000
	},
	initialize: function (camera, domElement) {
		this._camera = camera;
		if (domElement !== undefined) {
			this._domElement = domElement;
		}

		/* Mouse */
		// Disable default right click functionality
		B.DomEvent.on(this._domElement, 'contextmenu', B.DomEvent.preventDefault, this);
		// Mouse clicks
		B.DomEvent.on(this._domElement, 'mousedown', this._mousedown, this);
		// Mouse scroll
		B.DomEvent.on(this._domElement, 'mousewheel', this._mousewheel, this);
		B.DomEvent.on(this._domElement, 'DOMMouseScroll', this._mousewheel, this); // firefox

		/* Keyboard */
		// Keyboard button presses
		B.DomEvent.on(window, 'keydown', this._keydown, this);
		B.DomEvent.on(window, 'keyup', this._keyup, this);

		/* Touch */
		B.DomEvent.on(this._domElement, 'touchstart', this._touchstart, this);
		B.DomEvent.on(this._domElement, 'touchend', this._touchend, this);
		B.DomEvent.on(this._domElement, 'touchmove', this._touchmove, this);
	},
	zoomup: function () {
		this._camera.position.y += this.options.zoomIncrement;
		if (this._camera.position.y > this.options.maxZoomOutHeight) {
			this._camera.position.y = this.options.maxZoomOutHeight;
		}
	},
	zoomdown: function () {
		this._camera.position.y -= this.options.zoomIncrement;
		if (this._camera.position.y < this.options.maxZoomInHeight) {
			this._camera.position.y = this.options.maxZoomInHeight;
		}
	},
	zoominmax: function () {
		this._camera.position.y = this.options.maxZoomInHeight;
	},
	zoomoutmax: function () {
		this._camera.position.y = this.options.maxZoomOutHeight;
	},
	pannorth: function () {
		this._camera.position.x += this.options.panIncrement;
	},
	pansouth: function () {
		this._camera.position.x -= this.options.panIncrement;
	},
	paneast: function () {
		this._camera.position.z += this.options.panIncrement;
	},
	panwest: function () {
		this._camera.position.z -= this.options.panIncrement;
	},
	pitchup: function () {
		this._camera.rotation.y -= this.options.pitchIncrement;
	},
	pitchdown: function () {
		this._camera.rotation.y += this.options.pitchIncrement;
	},
	rotatecw: function () { },
	rotateccw: function () { },

	_keydown: function (event) {
		if (this._enabled === false) { return; }
		//window.removeEventListener('keydown', this._keydown);
		this._prevState = this._state;

		if (this._state !== this._STATE.NONE) {
			return;
		} else if (event.ctrlKey === true) {
			switch (event.keyCode) {
			case this.options.keys[this._STATE.PITCHUP]:
				this.pitchup();
				break;
			case this.options.keys[this._STATE.PITCHDOWN]:
				this.pitchdown();
				break;
			case this.options.keys[this._STATE.ROTATECW]:
				this.rotatecw();
				break;
			case this.options.keys[this._STATE.ROTATECCW]:
				this.rotateccw();
				break;
			default:
				break;
			}
		} else {
			//B.DomEvent.off(window, 'keydown', this._keydown);
			switch (event.keyCode) {
			case this.options.keys[this._STATE.ZOOMUP]:
				this.zoomup();
				break;
			case this.options.keys[this._STATE.ZOOMDOWN]:
				this.zoomdown();
				break;
			case this.options.keys[this._STATE.ZOOMINMAX]:
				this.zoominmax();
				break;
			case this.options.keys[this._STATE.ZOOMOUTMAX]:
				this.zoomoutmax();
				break;
			case this.options.keys[this._STATE.PANNORTH]:
				this.pannorth();
				break;
			case this.options.keys[this._STATE.PANSOUTH]:
				this.pansouth();
				break;
			case this.options.keys[this._STATE.PANEAST]:
				this.paneast();
				break;
			case this.options.keys[this._STATE.PANWEST]:
				this.panwest();
				break;
			default:
				return;
			}
		}
	},
	_keyup: function () {
	//_keyup: function (event) {
		if (this._enabled === false) { return; }
		this._state = this._prevState;
		//B.DomEvent.on(window, 'keydown', this._keydown, this);

	},
	_mousedown: function (event) {
		if (this._enabled === false) { return; }
		console.log(event);

	},
	_mousewheel: function (event) {
		if (this._enabled === false) { return; }
		console.log(event);

	},
	_touchstart: function (event) {
		if (this._enabled === false) { return; }
		console.log(event);

	},
	_touchend: function (event) {
		if (this._enabled === false) { return; }
		console.log(event);

	},
	_touchmove: function (event) {
		if (this._enabled === false) { return; }
		console.log(event);

	}
});