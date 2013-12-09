/*
 * B.Road is a class for drawing a road
 */

B.Building = B.Class.extend({
	_mesh: null,
	_tags: null,
	options: {
		levels: 2,
		levelHeight: 3.048, // meters
		wallMaterial: B.Materials.CONCRETEWHITE,
		roofMaterial: B.Materials.CONCRETEWHITE
	},
	initialize: function (geoParts, tags) {
		this._tags = tags;
		this._geometry = new THREE.Geometry();
		B.WebWorkerGeometryHelper.reconstruct(geoParts, this._geometry);

		
		var wallMatIndx = this._getMaterialIndex(tags['building:material'], this.options.wallMaterial);
		var roofMatIndx = this._getMaterialIndex(tags['roof:material'], this.options.roofMaterial);
		var mesh = this._mesh = new THREE.Mesh(this._geometry,
			/*new THREE.MeshBasicMaterial({
				color: 'red'
				//wireframe: true
			})*/
			new THREE.MeshFaceMaterial([
				B.Materials.MATERIALS[wallMatIndx],
				B.Materials.MATERIALS[roofMatIndx]
			])
		);

		mesh.position = new THREE.Vector3(geoParts.position.x, geoParts.position.y, 0);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return this;
	},
	_getMaterialIndex: function (tag, deflt) {
		/* 
		   Determine what material (or material index) should be used, based
		   on the tags 
		*/

		// TODO: Test this. building:material has been added to the CC
		var mat;
		
		switch (tag) {
		case 'glass':
			mat = B.Materials.GLASSBLUE;
			break;
		case 'wood':
			mat = B.Materials.WOODBROWN;
			break;
		case 'brick':
			mat = B.Materials.BRICKRED;
			break;
		case 'concrete':
			mat = B.Materials.CONCRETEWHITE;
			break;
		case 'sandstone':
			mat = B.Materials.SANDSTONEBROWN;
			break;
		case 'roof_tiles':
			mat = B.Materials.ROOFTILERED;
			break;
		default:
			mat = deflt;
			break;
		}
		
		return mat;
	}
});

B.BuildingHelper = {
	workerCallback: function (e) {
		var model = this._model;
		var terrain = this._model._terrain;

		var building = new B.Building(e.data.geometryParts, e.data.tags);

		// Run a terrain callback on that object
		terrain.addObjectCallback(building, function (object) {
			// Update the building's position
			terrain.updateObjPosition(object._mesh);
			// Add the object to the model
			model.addObject(object._mesh);
		}.bind(this));
	}
};
