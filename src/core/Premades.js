/* Load all pre-made models */

B.Premades = {
	_definitions: [
		{
			id: 'fireHydrant',
			url: B.Util.getDaePath() + '/fire_hydrant_red.dae'
		}
	],
	load: function (logger) {
		var loadedCounter = 0;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.options.upAxis = 'Z';
		loader.onProgress = function (item, loaded, total) {
			logger.log(item, loaded, total);
		};

		var onload = function (result) {
			B.Premades[def.id] = result.scene;
			loadedCounter++;
		};
		logger.log('Loading pre-made models');
		// Load all the models
		for (var i in B.Premades._definitions) {
			var def = B.Premades._definitions[i];
			// If the opions say to load the object
			//if (B.Options.render[def.id + 's']) {
			logger.log('Loading ' + def.id);

			loader.load(def.url, onload);
			//} else {
				//loadedCounter++;
			//}
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


