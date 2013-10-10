B.DefaultControl = B.Class.extend({

	_enabled: true,
	_camera: {},
	_domElement: document,

	_STATE: {NONE: -1, ZOOMUP: 0, ZOOMDOWN: 1, ZOOMMIN: 2, ZOOMMAX: 3,
		PANNORTH: 4, PANSOUTH: 5, PANEAST: 6, PANWEST: 7, PITCHUP: 8,
		PITCHDOWN: 9 },
	_state: -1, // Current state
	_prevState: -1, // Previous state

	options: {
		minCamHeight: 0,
		maxCamHeight: Infinity,
		keys: [33, 34, 35, 36, 38, 40, 39, 37, 38, 40]
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
	_keydown: function (event) {
		if (this._enabled === false) { return; }
		//window.removeEventListener('keydown', this._keydown);
		this._prevState = this._state;

		if (this._state !== this._STATE.NONE) {
			return;
		} else if (event.ctrlKey === true) {
			switch (event.keyCode) {
			case this.options.keys[this._STATE.PITCHUP]:
				console.log('pitchup');
				break;
			case this.options.keys[this._STATE.PITCHDOWN]:
				console.log('pitchdown');
				break;
			default:
				break;
			}
		} else {
			B.DomEvent.off(window, 'keydown', this._keydown);
			switch (event.keyCode) {
			case this.options.keys[this._STATE.ZOOMUP]:
				console.log('zoomup');
				break;
			case this.options.keys[this._STATE.ZOOMDOWN]:
				console.log('zoomdown');
				break;
			case this.options.keys[this._STATE.ZOOMMIN]:
				console.log('zoommin');
				break;
			case this.options.keys[this._STATE.ZOOMMAX]:
				console.log('zoommax');
				break;
			case this.options.keys[this._STATE.PANNORTH]:
				console.log('pannorth');
				break;
			case this.options.keys[this._STATE.PANSOUTH]:
				console.log('pansouth');
				break;
			case this.options.keys[this._STATE.PANEAST]:
				console.log('paneast');
				break;
			case this.options.keys[this._STATE.PANWEST]:
				console.log('panwest');
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
		B.DomEvent.on(window, 'keydown', this._keydown, this);

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