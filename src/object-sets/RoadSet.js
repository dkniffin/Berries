B.RoadSet = B.ObjectSet.extend({
	addTo: function (model) {
		var geo = this.getMergedGeometries();
		// Create a mesh
		var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
			color: 0x959393
		}));
		// Add it to the model
		console.log(mesh);
		model.addObject(mesh);
	}
});

B.roadset = function (id, options) {
	return new B.RoadSet(id, options);
};