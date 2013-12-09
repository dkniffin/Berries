var deps = {
	Core: {
		src: ['worker/WorkerB.js',
		      'worker/Worker.js',
		      'worker/WorkerHelper.js',
		      'worker/WebWorkerGeometryHelper.js',
		      'core/Class.js',
		      'core/Util.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js'],
		desc: 'Core components of web worker'
	},
	/*
	Materials: {
		src: ['materials/Material.js',
			  'materials/DefaultMaterials.js'],
		desc: 'Sets up materials to use in the model'
	},*/
	Generators: {
		src: ['worker/generateTerrain.js',
			  'worker/generateBuilding.js',
			  'worker/generateRoad.js'],
		desc: 'code to build various parts of the model',
		deps: ['Core']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
