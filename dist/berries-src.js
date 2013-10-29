/*
 Berries, a Javascript library for rendering geodata in 3d, using three.js
 Still very much a work in progress
 Created by Derek Kniffin
*/
(function (window, document, undefined) {/*
 * This file contains the top level stuff for berries
 */
var oldB = window.B,
    B = {};

B.version = '0.0.1';

// define Berries for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = B;

// define Berries as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(B);
}

// define Berries as a global B variable, saving the original B to restore later if needed

B.noConflict = function () {
	window.B = oldB;
	return this;
};

window.B = B;


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

// shortcuts for most used utility functions
B.extend = B.Util.extend;
B.bind = B.Util.bind;
B.stamp = B.Util.stamp;
B.setOptions = B.Util.setOptions;


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
 * B.Browser handles different browser and feature detections for internal Leaflet use.
 */

(function () {

	var ie = !!window.ActiveXObject,
	    ie6 = ie && !window.XMLHttpRequest,
	    ie7 = ie && !document.querySelector,
		ielt9 = ie && !document.addEventListener,

	    // terrible browser detection to work around Safari / iOS / Android browser bugs
	    ua = navigator.userAgent.toLowerCase(),
	    webkit = ua.indexOf('webkit') !== -1,
	    chrome = ua.indexOf('chrome') !== -1,
	    phantomjs = ua.indexOf('phantom') !== -1,
	    android = ua.indexOf('android') !== -1,
	    android23 = ua.search('android [23]') !== -1,

	    mobile = typeof orientation !== undefined + '',
	    msTouch = window.navigator && window.navigator.msPointerEnabled &&
	              window.navigator.msMaxTouchPoints,
	    retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
	             ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
	              window.matchMedia('(min-resolution:144dpi)').matches),

	    doc = document.documentElement,
	    ie3d = ie && ('transition' in doc.style),
	    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),
	    gecko3d = 'MozPerspective' in doc.style,
	    opera3d = 'OTransition' in doc.style,
	    any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;


	// PhantomJS has 'ontouchstart' in document.documentElement, but doesn't actually support touch.
	// https://github.com/Leaflet/Leaflet/pull/1434#issuecomment-13843151

	var touch = !window.L_NO_TOUCH && !phantomjs && (function () {

		var startName = 'ontouchstart';

		// IE10+ (We simulate these into touch* events in B.DomEvent and B.DomEvent.MsTouch) or WebKit, etc.
		if (msTouch || (startName in doc)) {
			return true;
		}

		// Firefox/Gecko
		var div = document.createElement('div'),
		    supported = false;

		if (!div.setAttribute) {
			return false;
		}
		div.setAttribute(startName, 'return;');

		if (typeof div[startName] === 'function') {
			supported = true;
		}

		div.removeAttribute(startName);
		div = null;

		return supported;
	}());


	B.Browser = {
		ie: ie,
		ie6: ie6,
		ie7: ie7,
		ielt9: ielt9,
		webkit: webkit,

		android: android,
		android23: android23,

		chrome: chrome,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: any3d,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: touch,
		msTouch: msTouch,

		retina: retina
	};

}());


B.Logger = B.Class.extend({

	_logFeedObj: null,
	options: {
		debug: false, // Whether to display debugging messages
		messageClasses: {
			debug: 'logMessageDebug',
			info: 'logMessageInfo',
			warn: 'logMessageWarn',
			error: 'logMessageError'
		},
		colors: {
			debug: '0000ff',
			info: '000000',
			warn: 'ffaa00',
			error: 'ff0000'
		}

	},
	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._logFeedObj = B.DomUtil.get(id);

		/* Define the styles */
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.' + options.messageClasses.debug + ' { color: ' + options.colors.debug + '; }';
		style.innerHTML += '.' + options.messageClasses.info + ' { color: ' + options.colors.info + '; }';
		style.innerHTML += '.' + options.messageClasses.warn + ' { color: ' + options.colors.warn + '; }';
		style.innerHTML += '.' + options.messageClasses.error + ' { color: ' + options.colors.error + '; }';

		document.getElementsByTagName('head')[0].appendChild(style);

	},
	log: function (message, type) {
		var options = this.options;
		
		if (!type) { type = 'info'; }
		var messageObj = document.createElement('p');
		messageObj.innerHTML = message;
		messageObj.className = options.messageClasses[type];


		this._logFeedObj.appendChild(messageObj);
		console[type](message);
	},
	hide: function () {
		console.log(this._logFeedObj);
		this._logFeedObj.style.display = 'none';
	},
	show: function () {
		this._logFeedObj.style.display = 'display';
	}
	
});

B.logger = function (id, options) {
	return new B.Logger(id, options);
};

B.Materials = {
	MATERIALS: [],
	addMaterial: function (name, material) {
		if (! name.match(/^[A-Z0-9]+$/)) {
			throw new Error('Material name does not match regex. Must be all uppercase alpha-numerical characters');
		}
		if (typeof this[name] !== 'undefined') {
			throw new Error('Material with name already exists. Use update instead.');
		}

		// Add the material to the materials array
		this.MATERIALS.push(material);

		// Add the index as a attrib for B.Materials
		this[name] = this.MATERIALS.length - 1;
	},
	updateMaterial: function (name, newMaterial) {
		if (typeof this[name] === 'undefined') {
			throw new Error('Material does not exist yet. Cannot update.');
		} else {
			var matindex = this[name];
			this.MATERIALS[matindex] = newMaterial;
		}
	},
	getMaterial: function (name) {
		return B.Materials.MATERIALS[this[name]];
	}

};

// Colored Materials
B.Materials.addMaterial('BRICKRED', new THREE.MeshPhongMaterial({color: 0x841F27, side: THREE.DoubleSide }));
B.Materials.addMaterial('CONCRETEWHITE', new THREE.MeshPhongMaterial({color: 0xF2F2F2, side: THREE.DoubleSide }));
B.Materials.addMaterial('GLASSBLUE', new THREE.MeshPhongMaterial({color: 0x009DDD, side: THREE.DoubleSide }));
B.Materials.addMaterial('ASPHALTGREY', new THREE.MeshPhongMaterial({color: 0x757575, side: THREE.DoubleSide }));
B.Materials.addMaterial('WOODBROWN', new THREE.MeshPhongMaterial({color: 0xAE8F60, side: THREE.DoubleSide }));

/*
 * B.Point represents a point with x and y coordinates.
 */

B.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

B.Point.prototype = {

	clone: function () {
		return new B.Point(this.x, this.y);
	},

	// non-destructive, returns a new point
	add: function (point) {
		return this.clone()._add(B.point(point));
	},

	// destructive, used directly for performance in situations where it's safe to modify existing point
	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(B.point(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	distanceTo: function (point) {
		point = B.point(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	equals: function (point) {
		point = B.point(point);

		return point.x === this.x &&
		       point.y === this.y;
	},

	contains: function (point) {
		point = B.point(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	toString: function () {
		return 'Point(' +
		        B.Util.formatNum(this.x) + ', ' +
		        B.Util.formatNum(this.y) + ')';
	}
};

B.point = function (x, y, round) {
	if (x instanceof B.Point) {
		return x;
	}
	if (B.Util.isArray(x)) {
		return new B.Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	return new B.Point(x, y, round);
};


/*
 * B.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

B.Transformation = function (a, b, c, d) {
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
};

B.Transformation.prototype = {
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	untransform: function (point, scale) {
		scale = scale || 1;
		return new B.Point(
		        (point.x / scale - this._b) / this._a,
		        (point.y / scale - this._d) / this._c);
	}
};


/*
 * B.DomUtil is a copy of L.DomUtil.
 * It contains various utility functions for working with DOM.
 */

B.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {

		var value = el.style[style];

		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}

		if ((!value || value === 'auto') && document.defaultView) {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	getViewportOffset: function (element) {

		var top = 0,
		    left = 0,
		    el = element,
		    docBody = document.body,
		    docEl = document.documentElement,
		    pos,
		    ie7 = B.Browser.ie7;

		do {
			top  += el.offsetTop  || 0;
			left += el.offsetBeft || 0;

			//add borders
			top += parseInt(B.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
			left += parseInt(B.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;

			pos = B.DomUtil.getStyle(el, 'position');

			if (el.offsetParent === docBody && pos === 'absolute') { break; }

			if (pos === 'fixed') {
				top  += docBody.scrollTop  || docEl.scrollTop  || 0;
				left += docBody.scrollLeft || docEl.scrollLeft || 0;
				break;
			}

			if (pos === 'relative' && !el.offsetLeft) {
				var width = B.DomUtil.getStyle(el, 'width'),
				    maxWidth = B.DomUtil.getStyle(el, 'max-width'),
				    r = el.getBoundingClientRect();

				if (width !== 'none' || maxWidth !== 'none') {
					left += r.left + el.clientLeft;
				}

				//calculate full y offset since we're breaking out of the loop
				top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);

				break;
			}

			el = el.offsetParent;

		} while (el);

		el = element;

		do {
			if (el === docBody) { break; }

			top  -= el.scrollTop  || 0;
			left -= el.scrollLeft || 0;

			// webkit (and ie <= 7) handles RTL scrollLeft different to everyone else
			// https://code.google.com/p/closure-library/source/browse/trunk/closure/goog/style/bidi.js
			if (!B.DomUtil.documentIsLtr() && (B.Browser.webkit || ie7)) {
				left += el.scrollWidth - el.clientWidth;

				// ie7 shows the scrollbar by default and provides clientWidth counting it, so we
				// need to add it back in if it is visible; scrollbar is on the left as we are RTL
				if (ie7 && B.DomUtil.getStyle(el, 'overflow-y') !== 'hidden' &&
				           B.DomUtil.getStyle(el, 'overflow') !== 'hidden') {
					left += 17;
				}
			}

			el = el.parentNode;
		} while (el);

		return new B.Point(left, top);
	},

	documentIsLtr: function () {
		if (!B.DomUtil._docIsLtrCached) {
			B.DomUtil._docIsLtrCached = true;
			B.DomUtil._docIsLtr = B.DomUtil.getStyle(document.body, 'direction') === 'ltr';
		}
		return B.DomUtil._docIsLtr;
	},

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
		}

		return el;
	},

	hasClass: function (el, name) {
		return (el.className.length > 0) &&
		        new RegExp('(^|\\s)' + name + '(\\s|$)').test(el.className);
	},

	addClass: function (el, name) {
		if (!B.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name;
		}
	},

	removeClass: function (el, name) {
		el.className = B.Util.trim((' ' + el.className + ' ').replace(' ' + name + ' ', ' '));
	},

	setOpacity: function (el, value) {

		if ('opacity' in el.style) {
			el.style.opacity = value;

		} else if ('filter' in el.style) {

			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) { return; }
			}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		}
	},

	testProp: function (props) {

		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {
		// on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
		// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
		// (same speed either way), Opera 12 doesn't support translate3d

		var is3d = B.Browser.webkit3d,
		    open = 'translate' + (is3d ? '3d' : '') + '(',
		    close = (is3d ? ',0' : '') + ')';

		return open + point.x + 'px,' + point.y + 'px' + close;
	},

	getScaleString: function (scale, origin) {

		var preTranslateStr = B.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
		    scaleStr = ' scale(' + scale + ') ';

		return preTranslateStr + scaleStr;
	},

	setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

		// jshint camelcase: false
		el._leaflet_pos = point;

		if (!disable3D && B.Browser.any3d) {
			el.style[B.DomUtil.TRANSFORM] =  B.DomUtil.getTranslateString(point);

			// workaround for Android 2/3 stability (https://github.com/CloudMade/Leaflet/issues/69)
			if (B.Browser.mobileWebkit3d) {
				el.style.WebkitBackfaceVisibility = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		// jshint camelcase: false
		return el._leaflet_pos;
	}
};


// prefix style property names

B.DomUtil.TRANSFORM = B.DomUtil.testProp(
        ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

B.DomUtil.TRANSITION = B.DomUtil.testProp(
        ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

B.DomUtil.TRANSITION_END =
        B.DomUtil.TRANSITION === 'webkitTransition' || B.DomUtil.TRANSITION === 'OTransition' ?
        B.DomUtil.TRANSITION + 'End' : 'transitionend';

(function () {
	var userSelectProperty = B.DomUtil.testProp(
		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	B.extend(B.DomUtil, {
		disableTextSelection: function () {
			B.DomEvent.on(window, 'selectstart', B.DomEvent.preventDefault);
			if (userSelectProperty) {
				var style = document.documentElement.style;
				this._userSelect = style[userSelectProperty];
				style[userSelectProperty] = 'none';
			}
		},

		enableTextSelection: function () {
			B.DomEvent.off(window, 'selectstart', B.DomEvent.preventDefault);
			if (userSelectProperty) {
				document.documentElement.style[userSelectProperty] = this._userSelect;
				delete this._userSelect;
			}
		},

		disableImageDrag: function () {
			B.DomEvent.on(window, 'dragstart', B.DomEvent.preventDefault);
		},

		enableImageDrag: function () {
			B.DomEvent.off(window, 'dragstart', B.DomEvent.preventDefault);
		}
	});
})();

/*
 * B.DomEvent contains functions for working with DOM events.
 */

B.DomEvent = {
	/* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

		var id = B.stamp(fn),
		    key = '_berries_' + type + id,
		    handler, originalHandler, newType;

		if (obj[key]) { return this; }

		handler = function (e) {
			return fn.call(context || obj, e || B.DomEvent._getEvent());
		};

		if (B.Browser.msTouch && type.indexOf('touch') === 0) {
			return this.addMsTouchListener(obj, type, handler, id);
		}
		if (B.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		}

		if ('addEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {

				originalHandler = handler;
				newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

				handler = function (e) {
					if (!B.DomEvent._checkMouse(obj, e)) { return; }
					return originalHandler(e);
				};

				obj.addEventListener(newType, handler, false);

			} else if (type === 'click' && B.Browser.android) {
				originalHandler = handler;
				handler = function (e) {
					return B.DomEvent._filterClick(e, originalHandler);
				};

				obj.addEventListener(type, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}

		} else if ('attachEvent' in obj) {
			obj.attachEvent('on' + type, handler);
		}

		obj[key] = handler;

		return this;
	},

	removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

		var id = B.stamp(fn),
		    key = '_berries_' + type + id,
		    handler = obj[key];

		if (!handler) { return this; }

		if (B.Browser.msTouch && type.indexOf('touch') === 0) {
			this.removeMsTouchListener(obj, type, id);
		} else if (B.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);

		} else if ('removeEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent('on' + type, handler);
		}

		obj[key] = null;

		return this;
	},

	stopPropagation: function (e) {

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		B.DomEvent._skipped(e);

		return this;
	},

	disableClickPropagation: function (el) {
		var stop = B.DomEvent.stopPropagation;

		for (var i = B.Draggable.START.length - 1; i >= 0; i--) {
			B.DomEvent.addListener(el, B.Draggable.START[i], stop);
		}

		return B.DomEvent
			.addListener(el, 'click', B.DomEvent._fakeStop)
			.addListener(el, 'dblclick', stop);
	},

	preventDefault: function (e) {

		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return this;
	},

	stop: function (e) {
		return B.DomEvent
			.preventDefault(e)
			.stopPropagation(e);
	},

	getMousePosition: function (e, container) {

		var ie7 = B.Browser.ie7,
		    body = document.body,
		    docEl = document.documentElement,
		    x = e.pageX ? e.pageX - body.scrollLeft - docEl.scrollLeft: e.clientX,
		    y = e.pageY ? e.pageY - body.scrollTop - docEl.scrollTop: e.clientY,
		    pos = new B.Point(x, y);

		if (!container) {
			return pos;
		}

		var rect = container.getBoundingClientRect(),
		    left = rect.left - container.clientLeft,
		    top = rect.top - container.clientTop;

		// webkit (and ie <= 7) handles RTL scrollLeft different to everyone else
		// https://code.google.com/p/closure-library/source/browse/trunk/closure/goog/style/bidi.js
		if (!B.DomUtil.documentIsLtr() && (B.Browser.webkit || ie7)) {
			left += container.scrollWidth - container.clientWidth;

			// ie7 shows the scrollbar by default and provides clientWidth counting it, so we
			// need to add it back in if it is visible; scrollbar is on the left as we are RTL
			if (ie7 && B.DomUtil.getStyle(container, 'overflow-y') !== 'hidden' &&
			           B.DomUtil.getStyle(container, 'overflow') !== 'hidden') {
				left += 17;
			}
		}

		return pos._subtract(new B.Point(left, top));
	},

	getWheelDelta: function (e) {

		var delta = 0;

		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	},

	_skipEvents: {},

	_fakeStop: function (e) {
		// fakes stopPropagation by setting a special event flag, checked/reset with B.DomEvent._skipped(e)
		B.DomEvent._skipEvents[e.type] = true;
	},

	_skipped: function (e) {
		var skipped = this._skipEvents[e.type];
		// reset when checking, as it's only used in map container and propagates outside of the map
		this._skipEvents[e.type] = false;
		return skipped;
	},

	// check if element really left/entered the event target (for mouseenter/mouseleave)
	_checkMouse: function (el, e) {

		var related = e.relatedTarget;

		if (!related) { return true; }

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}
		return (related !== el);
	},

	_getEvent: function () { // evil magic for IE
		/*jshint noarg:false */
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},

	// this is a horrible workaround for a bug in Android where a single touch triggers two click events
	_filterClick: function (e, handler) {
		var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
			elapsed = B.DomEvent._lastClick && (timeStamp - B.DomEvent._lastClick);

		// are they closer together than 1000ms yet more than 100ms?
		// Android typically triggers them ~300ms apart while multiple listeners
		// on the same event should be triggered far faster;
		// or check if click is simulated on the element, and if it is, reject any non-simulated events

		if ((elapsed && elapsed > 100 && elapsed < 1000) || (e.target._simulatedClick && !e._simulated)) {
			B.DomEvent.stop(e);
			return;
		}
		B.DomEvent._lastClick = timeStamp;

		return handler(e);
	}
};

B.DomEvent.on = B.DomEvent.addListener;
B.DomEvent.off = B.DomEvent.removeListener;


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


/*
 * B.Projection contains various geographical projections used by CRS classes.
 */

B.Projection = {};


/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

B.Projection.SphericalMercator = {
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) { // (LatLng) -> Point
		var d = B.LatLng.DEG_TO_RAD,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    x = latlng.lng * d,
		    y = lat * d;

		y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

		return new B.Point(x, y);
	},

	unproject: function (point) { // (Point, Boolean) -> LatLng
		var d = B.LatLng.RAD_TO_DEG,
		    lng = point.x * d,
		    lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;

		return new B.LatLng(lat, lng);
	}
};


/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

B.Projection.LonLat = {
	project: function (latlng) {
		return new B.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new B.LatLng(point.y, point.x);
	}
};


/*
 * B.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

B.CRS = {
	latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	project: function (latlng) {
		return this.projection.project(latlng);
	},

	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	}
};


/*
 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
 */

B.CRS.Simple = B.extend({}, B.CRS, {
	projection: B.Projection.LonLat,
	transformation: new B.Transformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	}
});


/*
 * B.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
 * and is used by Leaflet by default.
 */

B.CRS.EPSG3857 = B.extend({}, B.CRS, {
	code: 'EPSG:3857',

	projection: B.Projection.SphericalMercator,
	transformation: new B.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

	project: function (latlng) { // (LatLng) -> Point
		var projectedPoint = this.projection.project(latlng),
		    earthRadius = 6378137;
		return projectedPoint.multiplyBy(earthRadius);
	}
});

B.CRS.EPSG900913 = B.extend({}, B.CRS.EPSG3857, {
	code: 'EPSG:900913'
});


/*
 * B.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

B.CRS.EPSG4326 = B.extend({}, B.CRS, {
	code: 'EPSG:4326',

	projection: B.Projection.LonLat,
	transformation: new B.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
});


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
		panIncrement: 500,
		pitchIncrement: 0.1,
		maxZoomInHeight: 1600,
		maxZoomOutHeight: 50000
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
		this._camera.position.z += this.options.zoomIncrement;
		if (this._camera.position.z > this.options.maxZoomOutHeight) {
			this._camera.position.z = this.options.maxZoomOutHeight;
		}
	},
	zoomdown: function () {
		this._camera.position.z -= this.options.zoomIncrement;
		if (this._camera.position.z < this.options.maxZoomInHeight) {
			this._camera.position.z = this.options.maxZoomInHeight;
		}
	},
	zoominmax: function () {
		this._camera.position.z = this.options.maxZoomInHeight;
	},
	zoomoutmax: function () {
		this._camera.position.z = this.options.maxZoomOutHeight;
	},
	pannorth: function () {
		this._camera.position.y += this.options.panIncrement;
	},
	pansouth: function () {
		this._camera.position.y -= this.options.panIncrement;
	},
	paneast: function () {
		this._camera.position.x += this.options.panIncrement;
	},
	panwest: function () {
		this._camera.position.x -= this.options.panIncrement;
	},
	pitchup: function () {
		this._camera.rotation.x += this.options.pitchIncrement;
	},
	pitchdown: function () {
		this._camera.rotation.x -= this.options.pitchIncrement;
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

/*
 * This file contains the code necessary for terrain manipulation
 */

B.Terrain = B.Class.extend({
	options: {
		gridSpace: 50, // In meters
		dataType: 'SRTM_raster'
	},
	initialize: function (data, bounds, options) {
		options = B.setOptions(this, options);

		// Read in the data
		this._data = data;
	
		this._bounds = bounds;
		this._origin = this._bounds.getSouthWest();

		var width = this._origin.distanceTo(this._bounds.getSouthEast());
		var height = this._origin.distanceTo(this._bounds.getNorthWest());

		this._geometry = new THREE.PlaneGeometry(width, height, 199, 399);

		//this._geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		for (var i = 0, l = this._geometry.vertices.length; i < l; i++) {
			this._geometry.vertices[i].z = this._data[i] / 65535 * 4347;
		}
		THREE.GeometryUtils.triangulateQuads(this._geometry);
		this._geometry.computeFaceNormals();
		this._geometry.computeVertexNormals();


		this._createMesh();

		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;

		this._mesh.translateX(width / 2);
		this._mesh.translateY(height / 2);
	},
	heightAt: function (lat, lon, xym) {
		// Return the elevation of the terrain at the given lat/lon
		var ele; // The return value

		if (!this._bounds.contains([lat, lon])) {
			//throw new Error('Coordinates outside of bounds');
			console.error('Coordinates outside of bounds');
			return 0;
		}

		if (!xym) {
			xym = this._latlon2meters(lat, lon);
		}

		var rc = new THREE.Raycaster(
			new THREE.Vector3(xym.x, xym.y, 5000),
			new THREE.Vector3(0, 0, -1)
			);
		
		ele = rc.intersectObject(this._mesh);
		console.log(ele);

		return ele;
	},
	worldVector: function (lat, lon) {
		// Return a Vector3 with world coords for given lat, lon
		var xym = this._latlon2meters(lat, lon);

		var ele = this.heightAt(lat, lon, xym);

		return new THREE.Vector3(xym.x, xym.y, ele);
	},
	addTo: function (model) {
		model.addTerrain(this);
		console.log(model);
		return this;
	},
	_createMesh: function () {
		var texture = THREE.ImageUtils.loadTexture(B.Util.getTexturePath() + '/seamless-grass.jpg');
		var widthOfTexture = 10; // meters
		var heightOfTexture = 10; // meters
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(Math.round(this._dataDepthInMeters / heightOfTexture),
				Math.round(this._dataWidthInMeters / widthOfTexture));
		this._mesh = new THREE.Mesh(this._geometry, new THREE.MeshPhongMaterial({
			//map: texture
			wireframe: true,
			color: 0x0000ff
		}));
	},
	_latlon2meters: function (lat, lon) {
		// This function takes a lat/lon pair, and converts it to meters,
		// relative to the origin of the terrain, and returns x,y, and 
		// straightLine distances

		// normalize the input into a B.LatLng object
		var latlng = B.latLng(lat, lon);

		return {
			x: this._origin.distanceTo([this._origin.lat, latlng.lng]),
			y: this._origin.distanceTo([latlng.lat, this._origin.lng]),
			straightLine: latlng.distanceTo(this._origin)
		};
	}

});

B.terrain = function (id, options) {
	return new B.Terrain(id, options);
};


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
		dirLight.shadowCameraVisible = true;


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

/*
 * B.Road is a class for drawing a road
 */

B.Road = B.Class.extend({

	_osmDC: null,
	_way: null,
	_geometry: null,
	options: {
		lanes: 2,
		laneWidth: 3.5 // meters
	},
	initialize: function (way, osmDC, model, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

		// Do some logic to determine appropriate road width.
		var width = this.options.lanes * this.options.laneWidth; // Default to input options
		if (this._way.tags) {
			var tags = this._way.tags;
			if (tags.width) {
				// If the width tag is defined, use that
				width = tags.width;
			} else {
				// Otherwise, base the calculation on lanes
				var numLanes = this.options.lanes; // Total for the whole road
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
				var laneWidth = this.options.laneWidth;
				// TODO: add logic to look for 'lane:widths' values
				
				// TODO: account for bicycle lanes, etc
				width = numLanes * laneWidth;

			}
		}

		// Create the cross section shape
		// Credits go to bai (http://bai.dev.supcrit.com/scripts/engine/things/road.js)
		var thickness = 0.25,
	        thickscale = 4;
	    var roadpoints = [
			new THREE.Vector2(-1, 0),
			new THREE.Vector2(-1, -width / 2 - thickness * thickscale + 5),
			new THREE.Vector2(-1, -width / 2 - thickness * thickscale),
			new THREE.Vector2(0.1, -width / 2 - thickness * thickscale + 0.1),
			new THREE.Vector2(thickness * 0.75, -width / 2),
			new THREE.Vector2(thickness, -width / 2 + thickness * thickscale),
			new THREE.Vector2(thickness, width / 2 - thickness * thickscale),
			new THREE.Vector2(thickness * 0.75, width / 2),
			new THREE.Vector2(0.1, width / 2 + thickness * thickscale - 0.1),
			new THREE.Vector2(-1, width / 2 + thickness * thickscale),
			new THREE.Vector2(-1, width / 2 + thickness * thickscale - 5),
			new THREE.Vector2(-1, 0),
	    ];
	    var roadshape = new THREE.Shape(roadpoints);
	    //roadshape.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));


	    var splinepoints = [];
	    // Create the road spline (the path it follows)
		for (var i in this._way.nodes) {
			var nodeId = this._way.nodes[i];
			var node = this._osmDC.getNode(nodeId);
			var lat = Number(node.lat);
			var lon = Number(node.lon);
			var wvector = model.getTerrain().worldVector(lat, lon);

			wvector.y += thickness; // Add a meter, so it shows up above the surface

			splinepoints.push(wvector);
		}
		var roadspline = new THREE.SplineCurve3(splinepoints);

		this._geometry = new THREE.ExtrudeGeometry(roadshape, {extrudePath: roadspline });

	}
});

B.road = function (id, options) {
	return new B.Road(id, options);
};


/*
 * B.Road is a class for drawing a road
 */

B.Building = B.Class.extend({

	_way: {},
	_osmDC: null,
	_geometry: null,
	options: {
		levels: 2,
		levelHeight: 3.048, // meters
		wallMaterial: B.Materials.CONCRETEWHITE
	},
	initialize: function (way, osmDC, model, options) {
		options = B.setOptions(this, options);

		this._way = way;
		this._osmDC = osmDC;

		// Get the points that make up the outline of the building (in 3D)
		var outlinePoints = this._getOutlinePoints(this._way.nodes, this._osmDC, model);

		// TODO: Use min_height

		this._geometry = this._generateGeometry(outlinePoints, this._way);
		
		return this;

	},
	_generateGeometry: function (outlinePoints, way) {
		/* Generate the building geometry

			Algorithm:
			1. create the wall faces
			2. create the roof face

            TODO: Look into whether extrudeGeometry is more efficient. The
			reason I decided against it here is that I had trouble getting 
			it to work correctly.
			*/

		var buildingGeometry = this._geometry =  new THREE.Geometry();
		var i, j;

		// Some logic to determine the height of the building
		var height = this._getHeight(way.tags);
		

		// Use the lowest point of the building
		var groundLevel = outlinePoints[0].y;
		for (i in outlinePoints) {
			if (outlinePoints[i].y < groundLevel) {
				groundLevel = outlinePoints[i].y;
			}
		}
		var roofLevel = groundLevel + height;

		// Determine if the nodes are defined in a clockwise direction or CCW
		var clockwise = THREE.Shape.Utils.isClockWise(outlinePoints);

		if (!clockwise) {
			// Reverse CCW point sets
			outlinePoints.reverse();
		}

		var wallMaterialIndex = this._getWallMaterialIndex(way.tags);

		var roofPointsCoplanar = [];
		for (j in outlinePoints) {
			j = Number(j);
			var point = outlinePoints[j];
			var point2i = (j !== (outlinePoints.length - 1)) ? j + 1 : 0;
			var point2 = outlinePoints[point2i];

			// Create the geometry for one wall
			var wallGeometry = new THREE.Geometry();
			wallGeometry.vertices.push(new THREE.Vector3(point.x, groundLevel, point.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, groundLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point2.x, roofLevel, point2.z));
			wallGeometry.vertices.push(new THREE.Vector3(point.x, roofLevel, point.z));

			wallGeometry.faces.push(new THREE.Face3(2, 1, 0, null, null, wallMaterialIndex));
			wallGeometry.faces.push(new THREE.Face3(3, 2, 0, null, null, wallMaterialIndex));

			// Append it to the rest of the building geometry
			THREE.GeometryUtils.merge(buildingGeometry, wallGeometry);

			// create a 2D point for creating the roof
			roofPointsCoplanar.push(new THREE.Vector2(point.x, point.z));
		}


		// Create the geometry for the roof
		var roofGeometry = new THREE.Geometry();
		var roofShape = new THREE.Shape(roofPointsCoplanar);

		var shapePoints = roofShape.extractPoints();
		var faces = THREE.Shape.Utils.triangulateShape(shapePoints.shape, shapePoints.holes);

		for (i in shapePoints.shape) {
			var vertex = shapePoints.shape[i];
			roofGeometry.vertices.push(new THREE.Vector3(vertex.x, roofLevel, vertex.y));
		}
		for (i in faces) {
			roofGeometry.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2],
				null, null, B.Materials.ASPHALTGREY));
		}

		roofGeometry.computeFaceNormals();
		THREE.GeometryUtils.merge(buildingGeometry, roofGeometry);
		
		buildingGeometry.computeFaceNormals();

		return buildingGeometry;

	},
	_getOutlinePoints: function (nodes, osmDC, model) {
		// Get 3D points for the building outline
		var outlinePoints = [];
		var vec, lat, lon;
		var i;
		for (i in nodes) {
			var nodeId = nodes[i];
			var node = osmDC.getNode(nodeId);

			lat = Number(node.lat);
			lon = Number(node.lon);
			vec = model.getTerrain().worldVector(lat, lon);
			//vec.y += 1;
			outlinePoints.push(vec);
		}
		return outlinePoints;
	},
	_getHeight: function (tags) {
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
		var height = this.options.levels * this.options.levelHeight; // Default to input options
		if (tags) {
			if (tags.height) {
				// If the height tag is defined, use it
				// TODO: Check for various values (not meters)
				height = tags.height;
			} else {
				// Otherwise use levels for calculation
				var levels = this.options.levels;
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

				var levelHeight = this.options.levelHeight;

				height = levels * levelHeight;
			}
		}
		return height;
	},
	_getWallMaterialIndex: function (tags) {
		/* 
		Determine what material (or material index) should be used for the 
		walls of the building
		*/
		// TODO: Test this. building:material has been added to the CC
		var mat;
		
		switch (tags['building:material']) {
		case 'glass':
			mat = B.Materials.GLASSBLUE;
			break;
		case 'wood':
			mat = B.Materials.WOODBROWN;
			break;
		case 'brick':
			mat = B.Materials.BRICKRED;
			break;
		case 'concrete':
			mat = B.Materials.CONCRETEWHITE;
			break;
		default:
			mat = this.options.wallMaterial;
			break;
		}
		
		return mat;
	}
});

B.building = function (id, options) {
	return new B.Building(id, options);
};


B.FireHydrant = B.Class.extend({
	_node: null,
	options: {

	},
	initialize: function (node, options) {
		options = B.setOptions(this, options);

		this._node = node;

		return this;
	},
	addTo: function (model) {

		// Find where to put the model
		var node = this._node;

		var lat = Number(node.lat);
		var lon = Number(node.lon);
		var vec = model.getTerrain().worldVector(lat, lon);

		var loader = model._loadManager;

		loader.options.convertUpAxis = true;
		loader.load(B.Util.getDaePath() + '/fire_hydrant_red.dae', function (result) {
			
			//console.log(vec);

			var dae = result.scene;
			dae.position = vec;

			//dae.scale.x = dae.scale.y = dae.scale.z = 0.02539999969303608;

			dae.updateMatrix();


			//object.position.y = - 80;
			model.addObject(dae);

		});
	}
});

B.firehydrant = function (id, options) {
	return new B.Building(id, options);
};


B.ObjectSet = B.Class.extend({

	_objects: [],
	options: {

	},
	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._objects = [];
	},
	addObject: function (object) {
		// Add an object to the set
		this._objects.push(object);
	},
	getMergedGeometries: function () {
		// Join objects into a single geometry
		var mergedGeo = new THREE.Geometry();
		for (var i in this._objects) {
			THREE.GeometryUtils.merge(mergedGeo, this._objects[i]._geometry);
		}
		return mergedGeo;
	}
});

B.objectset = function (id, options) {
	return new B.ObjectSet(id, options);
};

B.RoadSet = B.ObjectSet.extend({
	addTo: function (model) {
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
			color: 0x959393
		}));
		// Add it to the model
		console.log(mesh);
		model.addObject(mesh);
	}
});

B.roadset = function (id, options) {
	return new B.RoadSet(id, options);
};

B.BuildingSet = B.ObjectSet.extend({
	// TODO: make a way to set these
	addTo: function (model) {
		// Add the object set to the model

		// Get the combined geometries of all buildings
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(B.Materials.MATERIALS));
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		// Add it to the model
		model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};

/* 
 * B.OSMDataContainer is reads in OSM data in JSON format, and allows 
 * access to various data (eg: roads, buildings, etc)
 */

B.OSMDataContainer = B.Class.extend({
	_nodes: [],
	_ways: [],
	_relations: [],
	options: {
		render: [/*'roads', */'buildings', 'fire_hydrants'],
	},
	initialize: function (data, options) {
		options = B.setOptions(this, options);

		this.addData(data);
		return this;
	},
	addTo: function (model) {
		// Loop over things to render, and add them each to the model
		for (var i in this.options.render) {
			var feature = this.options.render[i];

			var way, node;
			switch (feature) {
			case 'roads':
				var roads = this.get('roads');
				var roadSet = new B.roadset();
				for (var roadI in roads) {
					way = roads[roadI];
					
					roadSet.addObject(new B.Road(way, this, model));
				}
				roadSet.addTo(model);
				break;
			case 'buildings':
				var buildings = this.get('buildings');
				var bldgSet = new B.buildingset();
				for (var bId in buildings) {
					way = buildings[bId];
					//nodes = this.getNodesForWay(way);

					bldgSet.addObject(new B.Building(way, this, model));
				}
				bldgSet.addTo(model);
				break;
			case 'fire_hydrants':
				var fhs = this.get('fire_hydrants');
				for (var fhId in fhs) {
					node = fhs[fhId];
					//nodes = this.getNodesForWay(way);

					new B.FireHydrant(node).addTo(model);
				}
				break;
			}
		}
		//model.addObject();
	},
	addData: function (data) {

		if (!this._data) {
			// If the data doesn't already exist, simply add it

			this._nodes = data.nodes;
			this._ways = data.ways;
			this._relations = data.relations;
		} else {
			// TODO: check if this functionality works
			// Else, merge the two.
			
			B.Util.arrayMerge(this._nodes, data.nodes);
			B.Util.arrayMerge(this._ways, data.ways);
			B.Util.arrayMerge(this._relations, data.relations);
		}
	},
	get: function (feature) {
		// TODO: atm, this gets everything with the key highway. We should be 
		// checking for highway values that correspond to roads
		var features = [];
		var wayid, way;
		var nodeid, node;
		// /var relid, rel;

		switch (feature) {
		case 'roads':
			var roadValues = ['motorway', 'motorway_link', 'trunk', 'trunk_link',
				'primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary',
				'tertiary_link', 'residential', 'unclassified', 'service', 'track'];
			for (wayid in this._ways) {
				way = this._ways[wayid];
				if (!way.tags) {
					continue;
				}

				if (roadValues.indexOf(way.tags.highway) > -1) { // If roadValues contains tagVal
					features.push(way);
				}
			}
			break;
		case 'buildings':
			// TODO: Add relations
			for (wayid in this._ways) {
				way = this._ways[wayid];
				if (!way.tags) {
					continue;
				}

				var building = way.tags.building;
				if (building && building !== 'no') {
					features.push(way);
				}
			}
			break;
		case 'fire_hydrants':
			for (nodeid in this._nodes) {
				node = this._nodes[nodeid];
				if (!node.tags) {
					continue;
				}

				var emergency = node.tags.emergency;
				if (emergency && emergency === 'fire_hydrant') {
					features.push(node);
				}
			}
			break;
		}

		return features;
	},
	getNode: function (nodeId) {
		return this._nodes[nodeId];
	},
	getWay: function (wayId) {
		return this._ways[wayId];
	},
	getRelation: function (relId) {
		return this._relations[relId];
	}

});

B.osmdata = function (id, options) {
	return new B.OSMDataContainer(id, options);
};

}(window, document));