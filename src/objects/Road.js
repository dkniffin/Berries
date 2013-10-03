/*
 * 
 */

B.Road = B.Class.extend({

	options: {
	},
	initialize: function (way, nodes, options) {
		options = B.setOptions(this, options);
		
	},
	addTo: function (model) {
		model.addTerrain(this);
		return this;
	}
});

B.road = function (id, options) {
	return new B.Road(id, options);
};