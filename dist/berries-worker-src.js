/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
/* global B:true */
B = {};

/* 
B.Worker is a wrapper object for communications between the main thread and
the web worker 
*/

B.Worker = {
	/* global self */
	w: typeof window === 'undefined' ? self : new Worker('lib/js/berries/dist/berries-worker-src.js'),
	onMsgHandlers: {},
	addMsgHandler: function (id, func) {
		B.Worker.onMsgHandlers[id] = func;
	},
	sendMsg: function (msg, callback, transObjs) {
		// If a callback is given, define a msgHandler for it
		if (callback) { this.addMsgHandler(msg.action, callback); }
		B.Worker.w.postMessage(msg, transObjs);
	}
};

B.Worker.w.onmessage = function (e) {
	if (typeof B.Worker.onMsgHandlers[e.data.action] !== 'undefined') {
		B.Worker.onMsgHandlers[e.data.action](e);
	} else {
		throw new Error('Unknown action type recieved: ' + e.data.action);
	}
};


/* global importScripts */
// Add a MsgHandler to load external libraries (like THREE.js)
B.Worker.addMsgHandler('loadLibrary', function (e) {
	B.Logger.log('debug', 'Loading ' + e.data.url);
	importScripts(e.data.url);
});

// Send log messages back to the main thread
B.Logger = {
	log: function (type, message) {
		B.Worker.sendMsg({
			action: 'log',
			type: type,
			message: message
		});
	}
};

B.WebWorkerGeometryHelper = {
	deconstruct: function (geometry) {
		// Set the heights of each vertex
		var verts = new Float32Array(geometry.vertices.length * 3);
		for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			var vertex = geometry.vertices[i];

			verts[i * 3] = vertex.x;
			verts[i * 3 + 1] = vertex.y;
			verts[i * 3 + 2] = vertex.z;
		}
		var faces = new Float32Array(geometry.faces.length * 3);
		var mats = new Float32Array(geometry.faces.length);
		for (var j = 0, k = geometry.faces.length; j < k; j++) {
			var face = geometry.faces[j];

			faces[j * 3] = face.a;
			faces[j * 3 + 1] = face.b;
			faces[j * 3 + 2] = face.c;

			mats[j] = face.materialIndex;
		}
		
		return {faces: faces, verts: verts, mats: mats};
	},
	reconstruct: function (geoParts, geometry) {
		var verts = geoParts.vertices;
		for (var i = 0, l = verts.length; i < l; i += 3) {
			geometry.vertices[i / 3] = new THREE.Vector3(verts[i],
				verts[i + 1], verts[i + 2]);
		}

		var faces = geoParts.faces;
		var mats = geoParts.materials;
		for (var j = 0, k = faces.length; j < k; j += 3) {
			geometry.faces[j / 3] = new THREE.Face3(faces[j],
				faces[j + 1], faces[j + 2]);
			if (typeof mats !== 'undefined') {
				geometry.faces[j / 3].materialIndex = mats[j / 3];
			}
		}
		geometry.computeFaceNormals();

	}
};

/*
 * B.Class is just like Leaflet's L.Class. It powers the 
 * OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

B.Class = function () {};

B.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks) {
			this.callInitHooks();
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		B.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		B.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = B.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	B.extend(proto, props);

	proto._initHooks = [];

	var parent = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parent.prototype.callInitHooks) {
			parent.prototype.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// method for adding properties to prototype
B.Class.include = function (props) {
	B.extend(this.prototype, props);
};

// merge new default options to the Class
B.Class.mergeOptions = function (options) {
	B.extend(this.prototype.options, options);
};

// add a constructor hook
B.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};

/*
 * B.Util is a copy of L.Util.
 * It contains various utility functions used throughout Leaflet code.
 */

B.Util = {
	extend: function (dest) { // (Object[, Object, ...]) ->
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j] || {};
			for (i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},

	bind: function (fn, obj) { // (Function, Object) -> Function
		var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
		return function () {
			return fn.apply(obj, args || arguments);
		};
	},

	stamp: (function () {
		var lastId = 0,
		    key = '_berries_id';
		return function (obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),

	invokeEach: function (obj, method, context) {
		var i, args;

		if (typeof obj === 'object') {
			args = Array.prototype.slice.call(arguments, 3);

			for (i in obj) {
				method.apply(context, [i, obj[i]].concat(args));
			}
			return true;
		}

		return false;
	},

	limitExecByInterval: function (fn, time, context) {
		var lock, execOnUnlock;

		return function wrapperFn() {
			var args = arguments;

			if (lock) {
				execOnUnlock = true;
				return;
			}

			lock = true;

			setTimeout(function () {
				lock = false;

				if (execOnUnlock) {
					wrapperFn.apply(context, args);
					execOnUnlock = false;
				}
			}, time);

			fn.apply(context, args);
		};
	},

	falseFn: function () {
		return false;
	},

	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	splitWords: function (str) {
		return B.Util.trim(str).split(/\s+/);
	},

	setOptions: function (obj, options) {
		obj.options = B.extend({}, obj.options, options);
		return obj.options;
	},

	getParamString: function (obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},

	compileTemplate: function (str, data) {
		// based on https://gist.github.com/padolsey/6008842
		str = str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			return '" + o["' + key + '"]' + (typeof data[key] === 'function' ? '(o)' : '') + ' + "';
		});
		// jshint evil: true
		return new Function('o', 'return "' + str + '";');
	},

	template: function (str, data) {
		var cache = B.Util._templateCache = B.Util._templateCache || {};
		cache[str] = cache[str] || B.Util.compileTemplate(str, data);
		return cache[str](data);
	},

	arrayMerge: function (origData, addData) {
		// Algorithm taken from jQuery's merge function
		var len = +addData.length,
			j = 0,
			i = origData.length;

		for (; j < len; j++) {
			origData[i++] = addData[j];
		}
		origData.length = i;

		return origData;
	},

	isArray: function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	getBerriesPath: function () {
		var scripts = document.getElementsByTagName('script'),
		berriesRe = /[\/^]berries[\-\._]?([\w\-\._]*)\.js\??/;

		var i, len, src, matches, path;
		for (i = 0, len = scripts.length; i < len; i++) {
			src = scripts[i].src;
			matches = src.match(berriesRe);

			if (matches) {
				path = src.split(berriesRe)[0];
				return (path ? path + '/' : '');
			}
		}
	},

	getTexturePath: function () {
		return this.getBerriesPath() + 'textures';
	},
	getObjPath: function () {
		return this.getBerriesPath() + 'obj';
	},
	getDaePath: function () {
		return this.getBerriesPath() + 'dae';
	},

	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

if (typeof window !== 'undefined') {
	(function () {

		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

		function getPrefixed(name) {
			var i, fn,
			    prefixes = ['webkit', 'moz', 'o', 'ms'];

			for (i = 0; i < prefixes.length && !fn; i++) {
				fn = window[prefixes[i] + name];
			}

			return fn;
		}

		var lastTime = 0;

		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));

			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}

		var requestFn = window.requestAnimationFrame ||
		        getPrefixed('RequestAnimationFrame') || timeoutDefer;

		var cancelFn = window.cancelAnimationFrame ||
		        getPrefixed('CancelAnimationFrame') ||
		        getPrefixed('CancelRequestAnimationFrame') ||
		        function (id) { window.clearTimeout(id); };


		B.Util.requestAnimFrame = function (fn, context, immediate, element) {
			fn = B.bind(fn, context);

			if (immediate && requestFn === timeoutDefer) {
				fn();
			} else {
				return requestFn.call(window, fn, element);
			}
		};

		B.Util.cancelAnimFrame = function (id) {
			if (id) {
				cancelFn.call(window, id);
			}
		};

	}());
}

// shortcuts for most used utility functions
B.extend = B.Util.extend;
B.bind = B.Util.bind;
B.stamp = B.Util.stamp;
B.setOptions = B.Util.setOptions;


/*
 * B.LatLng represents a geographical point with latitude and longitude coordinates.
 */

B.LatLng = function (rawLat, rawLng) { // (Number, Number)
	var lat = parseFloat(rawLat),
	    lng = parseFloat(rawLng);

	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + rawLat + ', ' + rawLng + ')');
	}

	this.lat = lat;
	this.lng = lng;
};

B.extend(B.LatLng, {
	DEG_TO_RAD: Math.PI / 180,
	RAD_TO_DEG: 180 / Math.PI,
	MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

B.LatLng.prototype = {
	equals: function (obj) { // (LatLng) -> Boolean
		if (!obj) { return false; }

		obj = B.latLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= B.LatLng.MAX_MARGIN;
	},

	toString: function (precision) { // (Number) -> String
		return 'LatLng(' +
		        B.Util.formatNum(this.lat, precision) + ', ' +
		        B.Util.formatNum(this.lng, precision) + ')';
	},

	// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
	// TODO move to projection code, LatLng shouldn't know about Earth
	distanceTo: function (other) { // (LatLng) -> Number
		other = B.latLng(other);

		var R = 6378137, // earth radius in meters
		    d2r = B.LatLng.DEG_TO_RAD,
		    dLat = (other.lat - this.lat) * d2r,
		    dLon = (other.lng - this.lng) * d2r,
		    lat1 = this.lat * d2r,
		    lat2 = other.lat * d2r,
		    sin1 = Math.sin(dLat / 2),
		    sin2 = Math.sin(dLon / 2);

		var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	},

	wrap: function (a, b) { // (Number, Number) -> LatLng
		var lng = this.lng;

		a = a || -180;
		b = b ||  180;

		lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

		return new B.LatLng(this.lat, lng);
	}
};

B.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
	if (a instanceof B.LatLng) {
		return a;
	}
	if (B.Util.isArray(a)) {
		return new B.LatLng(a[0], a[1]);
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new B.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
	}
	return new B.LatLng(a, b);
};



/*
 * B.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

B.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
	if (!southWest) { return; }

	var latlngs = northEast ? [southWest, northEast] : southWest;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
};

B.LatLngBounds.prototype = {
	// extend the bounds to contain the given point or bounds
	extend: function (obj) { // (LatLng) or (LatLngBounds)
		if (!obj) { return this; }

		if (typeof obj[0] === 'number' || typeof obj[0] === 'string' || obj instanceof B.LatLng) {
			obj = B.latLng(obj);
		} else {
			obj = B.latLngBounds(obj);
		}

		if (obj instanceof B.LatLng) {
			if (!this._southWest && !this._northEast) {
				this._southWest = new B.LatLng(obj.lat, obj.lng);
				this._northEast = new B.LatLng(obj.lat, obj.lng);
			} else {
				this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
				this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

				this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
				this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
			}
		} else if (obj instanceof B.LatLngBounds) {
			this.extend(obj._southWest);
			this.extend(obj._northEast);
		}
		return this;
	},

	// extend the bounds by a percentage
	pad: function (bufferRatio) { // (Number) -> LatLngBounds
		var sw = this._southWest,
		    ne = this._northEast,
		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new B.LatLngBounds(
		        new B.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new B.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	getCenter: function () { // -> LatLng
		return new B.LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	getSouthWest: function () {
		return this._southWest;
	},

	getNorthEast: function () {
		return this._northEast;
	},

	getNorthWest: function () {
		return new B.LatLng(this.getNorth(), this.getWest());
	},

	getSouthEast: function () {
		return new B.LatLng(this.getSouth(), this.getEast());
	},

	getWest: function () {
		return this._southWest.lng;
	},

	getSouth: function () {
		return this._southWest.lat;
	},

	getEast: function () {
		return this._northEast.lng;
	},

	getNorth: function () {
		return this._northEast.lat;
	},

	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof B.LatLng) {
			obj = B.latLng(obj);
		} else {
			obj = B.latLngBounds(obj);
		}

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof B.LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	intersects: function (bounds) { // (LatLngBounds)
		bounds = B.latLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	toBBoxString: function () {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	equals: function (bounds) { // (LatLngBounds)
		if (!bounds) { return false; }

		bounds = B.latLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest()) &&
		       this._northEast.equals(bounds.getNorthEast());
	},

	isValid: function () {
		return !!(this._southWest && this._northEast);
	}
};

//TODO International date line?

B.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
	if (!a || a instanceof B.LatLngBounds) {
		return a;
	}
	return new B.LatLngBounds(a, b);
};


B.Worker.addMsgHandler('generateTerrain', function (e) {
	/* Input:
	  - data
	  - options
	    - bounds
	    - numVertsX
	    - numVertsY
	*/
	var options = e.data.options;

	// Download the data
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'arraybuffer';
	xhr.open('GET', e.data.srtmDataSource, true);
	xhr.onload = function () {
		// When the data is finished downloading
		if (xhr.response) {
			var data = new Uint16Array(xhr.response);
			B.Logger.log('info', 'Getting SRTM data');

			var bounds = B.latLngBounds([[options.bounds[0].lat, options.bounds[0].lng],
										 [options.bounds[1].lat, options.bounds[1].lng]]);
			var numVertsX = options.numVertsX;
			var numVertsY = options.numVertsY;

			// Set the origin to the southwest corner of the bounds
			var origin = bounds.getSouthWest();

			// Calculate the width and height of the bounds
			var width = origin.distanceTo(bounds.getSouthEast());
			var height = origin.distanceTo(bounds.getNorthWest());

			// Create the geometry
			B.Logger.log('log', 'Creating the terrain geometry');
			var geometry = new THREE.PlaneGeometry(width, height, numVertsX - 1, numVertsY - 1);
			var gridSpaceX = width / (numVertsX - 1);
			var gridSpaceY = height / (numVertsY - 1);

			// This part does most of the work. What it does is loops over
			// each vertex in the geometry and assigns the corresponding value
			// from the data
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
				geometry.vertices[i].z = data[i] / 65535 * 4347;
			}


			var deconstructedGeo = B.WebWorkerGeometryHelper.deconstruct(geometry);


			//THREE.GeometryUtils.triangulateQuads(geometry);
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
				
			B.Logger.log('debug', 'Returning geometry...');
			B.Worker.sendMsg({
				action: 'generateTerrain',
				geometryParts: {
					vertices: deconstructedGeo.verts,
					faces: deconstructedGeo.faces,
					width: width,
					height: height,
					numVertsX: numVertsX,
					numVertsY: numVertsY,
					gridSpaceX: gridSpaceX,
					gridSpaceY: gridSpaceY
				}
			}, null, [
				deconstructedGeo.verts.buffer,
				deconstructedGeo.faces.buffer
			]);

		}
	};
	xhr.send(null);
});


function getHeight(tags, options) {
	/* Return the height of the building

	   In descending order of preference:
	   - height=* tag
	   - levels * levelheight calculation
	    - levels based on:
	     - levels=* tag
	     - building=* tags (building type)
	     - options.levels
	    - levelheight based on:
	     - options.levelHeight
	*/
	var height = options.levels * options.levelHeight; // Default to input options
	if (tags) {
		if (tags.height) {
			// If the height tag is defined, use it
			// TODO: Check for various values (not meters)
			height = tags.height;
		} else {
			// Otherwise use levels for calculation
			var levels = options.levels;
			if (tags['building:levels']) {
				levels = tags['building:levels'];
			} else if (tags.building) {
				switch (tags.building) {
				case 'house':
				case 'garage':
				case 'roof': // TODO: Handle this separately
				case 'hut':
					levels = 1;
					break;
				case 'school':
					levels = 2;
					break;
				case 'apartments':
				case 'office':
					levels = 3;
					break;
				case 'hospital':
					levels = 4;
					break;
				case 'hotel':
					levels = 10;
					break;
				}
			}

			var levelHeight = options.levelHeight;

			height = levels * levelHeight;
		}
	}
	return height;
}

B.Worker.addMsgHandler('generateBuilding', function (e) {
	//B.Logger.log('debug', 'Generating Building');

	// Inputs
	var oIn = e.data.origin;
	var origin = B.latLng(oIn.lat, oIn.lng);
	var nodes = e.data.nodes;
	var tags = e.data.tags;
	var options = e.data.options;

	var buildingGeometry =  new THREE.Geometry();
	var i;


	var translation = {
		x: origin.distanceTo([origin.lat, nodes[0].lon]),
		y: origin.distanceTo([nodes[0].lat, origin.lng])
	};
	// Convert the node points (lat/lon) to an array of Vector2
	var outlinePoints = [];
	for (i in nodes) {
		outlinePoints[i] = new THREE.Vector2(
			origin.distanceTo([origin.lat, nodes[i].lon]) - translation.x,
			origin.distanceTo([nodes[i].lat, origin.lng]) - translation.y
		);
	}
	var crossSection = new THREE.Shape(outlinePoints);

	// Determine if the nodes are defined in a clockwise direction or CCW
	var clockwise = THREE.Shape.Utils.isClockWise(outlinePoints);

	if (!clockwise) {
		// Reverse CCW point sets
		outlinePoints.reverse();
	}

	//B.Logger.log('debug', 'outlinePoints: ' + outlinePoints.length);


	// Some logic to determine the height of the building
	var height = getHeight(tags, options.heightOptions);

	// Use 0; the position in the model will be used later to place the object
	// on the ground
	var groundLevel = 0;
	
	var roofLevel = groundLevel + height;


	var extrudespline = new THREE.SplineCurve3([
		new THREE.Vector3(0, 0, groundLevel),
		new THREE.Vector3(0, 0, roofLevel)
    ]);
	
	var steps = 2;

	var frames = {tangents: [], normals: [], binormals: []};
	var normal = new THREE.Vector3(1, 0, 0);
	for (i = 0; i < steps + 1; i++) {
		var u = i / steps;
		var tangent = extrudespline.getTangentAt(u).normalize();
		frames.tangents[i] = tangent;
		frames.normals[i] = normal;
		frames.binormals[i] = tangent.clone().cross(normal);
	}


	buildingGeometry = new THREE.ExtrudeGeometry(crossSection, {
		extrudePath: extrudespline,
		steps: steps,
		frames: frames,
		closed: true,
		extrudeMaterial: 0,
		material: 1
	});
	buildingGeometry.uvsNeedUpdate = true;

	
	var deconstructedGeo = B.WebWorkerGeometryHelper.deconstruct(buildingGeometry);


	B.Worker.sendMsg({
		action: 'generateBuilding',
		tags: tags,
		geometryParts: {
			vertices: deconstructedGeo.verts,
			faces: deconstructedGeo.faces,
			materials: deconstructedGeo.mats,
			position: translation
		}
	}, null, [
		deconstructedGeo.verts.buffer,
		deconstructedGeo.faces.buffer,
		deconstructedGeo.mats.buffer
	]);
});



function roadWidth(tags, options) {
		// Do some logic to determine appropriate road width.
	var width = options.lanes * options.laneWidth; // Default to input options
	if (tags) {
		if (tags.width) {
			// If the width tag is defined, use that
			width = tags.width;
		} else {
			// Otherwise, base the calculation on lanes
			var numLanes = options.lanes; // Total for the whole road
			if (tags.lanes) {
				numLanes = tags.lanes;
			} else if (tags.highway) {
				switch (tags.highway) {
				case 'motorway':
				case 'trunk':
				case 'primary':
				case 'secondary':
					numLanes = 4;
					break;
				case 'tertiary':
				case 'residential':
					numLanes = 2;
					break;
				case 'service':
				case 'track':
					numLanes = 1;
					break;
				}
			}
			var laneWidth = options.laneWidth;
			// TODO: add logic to look for 'lane:widths' values
			
			// TODO: account for bicycle lanes, etc
			width = numLanes * laneWidth;

		}
	}
	return width;
}

B.Worker.addMsgHandler('generateRoad', function (e) {
	//B.Logger.log('debug', 'Generating Road');
	var oIn = e.data.origin;
	var origin = B.latLng(oIn.lat, oIn.lng);
	var nodes = e.data.nodes;
	var tags = e.data.tags;
	var options = e.data.options;

	var translation = {
		x: origin.distanceTo([origin.lat, nodes[0].lon]),
		y: origin.distanceTo([nodes[0].lat, origin.lng])
	};



	// Get the width of the road
	var width = roadWidth(tags, options);

	// Create the cross section shape
    var thickness = options.roadThickness;
	var crossSectionPoints = [
		new THREE.Vector2(-width / 2, 0),
		new THREE.Vector2(-width / 2,  thickness),
		new THREE.Vector2(width / 2, thickness),
		new THREE.Vector2(width / 2, 0)
    ];
    var crossSection = new THREE.Shape(crossSectionPoints);



    var splinePoints = [];
    // Create the road spline (the path it follows)
	for (var i in nodes) {
		// Convert the node points (lat/lon) to an array of Vector2
		splinePoints[i] = new THREE.Vector3(
			origin.distanceTo([origin.lat, nodes[i].lon]) - translation.x,
			origin.distanceTo([nodes[i].lat, origin.lng]) - translation.y,
			0
		);
	}

	//B.Logger.log('debug', splinePoints);
	var roadspline;
	if (splinePoints[0].equals(splinePoints[splinePoints.length - 1])) {
		splinePoints.pop();
		roadspline = new THREE.ClosedSplineCurve3(splinePoints);
	} else {
		roadspline = new THREE.SplineCurve3(splinePoints);
	}

	/*var steps = Math.floor(roadspline.getLength() / 4);
	if (steps < 1) { steps = 1; }*/
	var steps = splinePoints.length;

	var frames = {tangents: [], normals: [], binormals: []};
	var normal = new THREE.Vector3(1, 0, 0);
	for (i = 0; i < steps + 1; i++) {
		var u = i / steps;
		var tangent = roadspline.getTangentAt(u).normalize();
		frames.tangents[i] = tangent;
		frames.normals[i] = normal;
		frames.binormals[i] = tangent.clone().cross(normal);
	}


	//B.Logger.log('debug', 'Creating ExtrudeGeometry');
	var geometry = new THREE.ExtrudeGeometry(crossSection, {
		extrudePath: roadspline,
		steps: steps,
		frames: frames,
		closed: true,
		extrudeMaterial: 0
	});

	//B.Logger.log('debug', 'Sending geometry back');
	// Send back the deconstructed geometry
	var deconstructedGeo = B.WebWorkerGeometryHelper.deconstruct(geometry);
	B.Worker.sendMsg({
		action: 'generateRoad',
		tags: tags,
		geometryParts: {
			vertices: deconstructedGeo.verts,
			faces: deconstructedGeo.faces,
			materials: deconstructedGeo.mats,
			position: translation
		}
	}, null, [
		deconstructedGeo.verts.buffer,
		deconstructedGeo.faces.buffer,
		deconstructedGeo.mats.buffer
	]);
});



