B.WebWorkerGeometryHelper = {
	deconstruct: function (geometry) {
		// Set the heights of each vertex
		var verts = new Float32Array(geometry.vertices.length * 3);
		for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			var vertex = geometry.vertices[i];

			verts[i * 3] = vertex.x;
			verts[i * 3 + 1] = vertex.y;
			verts[i * 3 + 2] = vertex.z;
		}
		var faces = new Float32Array(geometry.faces.length * 3);
		var mats = new Float32Array(geometry.faces.length);
		for (var j = 0, k = geometry.faces.length; j < k; j++) {
			var face = geometry.faces[j];

			faces[j * 3] = face.a;
			faces[j * 3 + 1] = face.b;
			faces[j * 3 + 2] = face.c;

			mats[j] = face.materialIndex;
		}
		
		return {faces: faces, verts: verts, mats: mats};
	},
	reconstruct: function (geoParts, geometry) {
		var verts = geoParts.vertices;
		for (var i = 0, l = verts.length; i < l; i += 3) {
			geometry.vertices[i / 3] = new THREE.Vector3(verts[i],
				verts[i + 1], verts[i + 2]);
		}

		var faces = geoParts.faces;
		var mats = geoParts.materials;
		for (var j = 0, k = faces.length; j < k; j += 3) {
			geometry.faces[j / 3] = new THREE.Face3(faces[j],
				faces[j + 1], faces[j + 2]);
			if (typeof mats !== 'undefined') {
				geometry.faces[j / 3].materialIndex = mats[j / 3];
			}
		}
		geometry.computeFaceNormals();

	}
};