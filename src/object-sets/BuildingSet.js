B.BuildingSet = B.ObjectSet.extend({
	addTo: function (model) {
		//var geo = this.getMergedGeometries();
		//var mats = this.getMergedMaterials();
		// Create a mesh
		//var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(mats));
		for (var i in this._objects) {
			model.addObject(this._objects[i]._mesh);
		}
		// Add it to the model
		//model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};