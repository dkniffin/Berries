B.BuildingSet = B.ObjectSet.extend({
	addTo: function (model) {
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
			color: 0x0000ff,
			wireframe: true
		}));
		// Add it to the model
		model.addObject(mesh);
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};