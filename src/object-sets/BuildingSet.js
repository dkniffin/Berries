B.BuildingSet = B.ObjectSet.extend({
	// TODO: make a way to set these
	_materials: [new THREE.MeshBasicMaterial({color: 0x841F27, side: THREE.DoubleSide }), // Wall
				 new THREE.MeshBasicMaterial({color: 0xF2F2F2, side: THREE.DoubleSide })], // Roof
	addTo: function (model) {
		// Add the object set to the model

		// Get the combined geometries of all buildings
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(this._materials));
		// Add it to the model
		model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};