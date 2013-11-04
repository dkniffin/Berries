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

		var fh = B.Premades.fireHydrant.clone();
		fh.position = vec;

		model.addObject(fh);

	}
});

B.firehydrant = function (id, options) {
	return new B.Building(id, options);
};
