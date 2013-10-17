B.Materials = {
	MATERIALS: [],
	addMaterial: function (name, material) {
		if (! name.match(/^[A-Z0-9]+$/)) {
			throw new Error('Material name does not match regex. Must be all uppercase alpha-numerical characters');
		}
		if (typeof this[name] !== 'undefined') {
			throw new Error('Material with name already exists. Use update instead.');
		}

		// Add the material to the materials array
		this.MATERIALS.push(material);

		// Add the index as a attrib for B.Materials
		this[name] = this.MATERIALS.length - 1;
	},
	updateMaterial: function (name, newMaterial) {
		if (typeof this[name] === 'undefined') {
			throw new Error('Material does not exist yet. Cannot update.');
		} else {
			var matindex = this[name];
			this.MATERIALS[matindex] = newMaterial;
		}
	},
	getMaterial: function (name) {
		return B.Materials.MATERIALS[this[name]];
	}

};