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
