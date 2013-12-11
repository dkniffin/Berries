B.Tree = B.Class.extend({
	options: {

	},
	initialize: function (node, options) {
		options = B.setOptions(this, options);

		this._node = node;
		this._mesh = B.Premades.deciduousTree.clone();
		console.log(this._mesh);

		return this;
	},
	addTo: function (model) {
		var node = this._node;

		var terrain = model._terrain;
		// Run a terrain callback on that object
		terrain.addObjectCallback(this, function (object) {
			var lat = Number(node.lat);
			var lon = Number(node.lon);
			var vec = model.getTerrain().worldVector(lat, lon);
			this._mesh.position = vec;

			// Update the building's position
			terrain.updateObjPosition(object._mesh);
			// Add the object to the model
			model.addObject(object._mesh);
		}.bind(this));

	}
});
