var deps = {
	Core: {
		src: ['worker/WorkerB.js',
		      'worker/Worker.js'],
		desc: 'Core components of web worker'
	},
	Generators: {
		src: ['worker/generateBuilding.js'],
		desc: 'code to build various parts of the model',
		deps: ['Core']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
