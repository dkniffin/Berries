/* Premade objects container */

B.Premades = {
	_definitions: [ // Definitions for each premade object
		{
			id: 'deciduousTree',
			url: B.Util.getDaePath() + '/deciduous.dae'
		},
		{
			id: 'fireHydrant',
			url: B.Util.getDaePath() + '/fire_hydrant_red.dae'
		}
	],
	load: function (logger) {
		// Load the premade objects (download them and save them to memory)
		var loadedCounter = 0;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.options.upAxis = 'Z';
		loader.onProgress = function (item, loaded, total) {
			logger.log(item, loaded, total);
		};

		var onload = function (result) {
			// Save the object as B.Premades.<id> to be referenced later
			B.Premades[this.id] = result.scene;
			console.log(result);
			loadedCounter++;
		};
		logger.log('Loading pre-made models');
		// Load all the models
		for (var i in B.Premades._definitions) {
			var def = B.Premades._definitions[i];
			logger.log('Loading ' + def.id);

			loader.load(def.url, onload.bind(def));
		}


		// Set a timer. At each tick, check if loadedCounter === numObjects. 
		// If it is, exit, else, continue timer.
		var timer = window.setInterval(function () {
			if (loadedCounter === B.Premades._definitions.length) {
				logger.log('Finished loading premade models');
				clearInterval(timer);
			}
		}, 500);
	}
};


