B.BuildingSet = B.ObjectSet.extend({
	addTo: function (model) {
		//var geo = this.getMergedGeometries();
		for (var i in this._objects) {
			var geo = this._objects[i]._geometry;
			// Create a mesh
			var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
				color: 0x0000ff,
				side: THREE.DoubleSide
			}));
			mesh.position.y = 3000;
			// Add it to the model
			model.addObject(mesh);
		}
	}
});

B.buildingset = function (id, options) {
	return new B.BuildingSet(id, options);
};