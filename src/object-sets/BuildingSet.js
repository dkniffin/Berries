B.BuildingSet = B.ObjectSet.extend({
	// TODO: make a way to set these
	addTo: function (model) {
		// Add the object set to the model

		// Get the combined geometries of all buildings
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(B.Materials.MATERIALS));
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		// Add it to the model
		model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};