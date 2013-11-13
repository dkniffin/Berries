var deps = {
	Core: {
		src: ['worker/WorkerB.js',
		      'worker/Worker.js',
		      'worker/WorkerHelper.js',
		      'core/Class.js',
		      'core/Util.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js'],
		desc: 'Core components of web worker'
	},
	Generators: {
		src: ['worker/generateTerrain.js'],
		desc: 'code to build various parts of the model',
		deps: ['Core']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
