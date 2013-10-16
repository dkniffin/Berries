B.BuildingSet = B.ObjectSet.extend({
	addTo: function (model) {
		var geo = this.getMergedGeometries();
		var mats = this.getMergedMaterials();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(mats));
		// Add it to the model
		model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};