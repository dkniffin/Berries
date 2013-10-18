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

		var loader = new THREE.ColladaLoader();
		console.log(B.Util.getDaePath() + '/fire_hydrant.dae');
		loader.load(B.Util.getDaePath() + '/fire_hydrant.dae', function (result) {
			
			//console.log(vec);

			var dae = result.scene;
			dae.position = vec;

			dae.updateMatrix();


			//object.position.y = - 80;
			console.log(result);
			model.addObject(result);

		});
	}
});

B.firehydrant = function (id, options) {
	return new B.Building(id, options);
};
