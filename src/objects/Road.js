/* B.Road is a class for drawing a road */

B.Road = B.Class.extend({

	_osmDC: null,
	_way: null,
	options: {
	},
	initialize: function (geoParts, tags) {
		this._tags = tags;
		this._geometry = new THREE.Geometry();

		B.WebWorkerGeometryHelper.reconstruct(geoParts, this._geometry);
		var roadMatIndx = B.Materials.ASPHALTGREY;
		var mesh = this._mesh = new THREE.Mesh(this._geometry,
			/*new THREE.MeshBasicMaterial({
				color: 'red'
				//wireframe: true
			})*/
			new THREE.MeshFaceMaterial([
				B.Materials.MATERIALS[roadMatIndx]
			])
		);
		mesh.position = new THREE.Vector3(geoParts.position.x, geoParts.position.y, 0);
		//mesh.castShadow = true;
		mesh.receiveShadow = true;

		return this;

	}
});

B.RoadHelper = {
	workerCallback: function (e) {
		var model = this._model;
		var terrain = this._model._terrain;

		var road = new B.Road(e.data.geometryParts, e.data.tags);

		// Run a terrain callback on that object
		terrain.addObjectCallback(road, function (object) {
			// Update the building's position
			terrain.updateObjPosition(object._mesh);
			// Add the object to the model
			model.addObject(object._mesh);
		}.bind(this));
	}
};