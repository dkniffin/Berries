B.ObjectSet = B.Class.extend({

	_objects: [],
	options: {

	},
	initialize: function (id, options) {
		options = B.setOptions(this, options);

		this._objects = [];
	},
	addObject: function (object) {
		this._objects.push(object);
	},
	getMergedGeometries: function () {
		var mergedGeo = new THREE.Geometry();
		// Join objects into a single geometry
		for (var i in this._objects) {
			THREE.GeometryUtils.merge(mergedGeo, this._objects[i]._geometry);
		}
		return mergedGeo;
	}

});

B.objectset = function (id, options) {
	return new B.ObjectSet(id, options);
};