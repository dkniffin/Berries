/* 
 * B.OSMDataContainer is reads in OSM data in JSON format, and allows 
 * access to various data (eg: roads, buildings, etc)
 */

B.OSMDataContainer = B.Class.extend({
	_nodes: [],
	_ways: [],
	_relations: [],
	options: {
		render: ['roads'],
	},
	initialize: function (data, options) {
		options = B.setOptions(this, options);

		this.addData(data);
		return this;
	},
	addTo: function (model) {
		// Loop over things to render, and add them each to the model
		for (var i in this.options.render) {
			var feature = this.options.render[i];

			switch (feature) {
			case 'roads':
				var roads = this.get('roads');
				for (var roadI in roads) {
					var road = roads[roadI];
					var nodes = [];
					for (var nodeI in roads.nd) {
						nodes.push(roads.nd[nodeI]);
					}
				}
			}
		}
		//model.addObject();
		console.log(model);
	},
	addData: function (data) {

		data.node.forEach(function (node) {
			this._nodes[]
		});
		

		if (!this._data) {
			// If the data doesn't already exist, simply add it
			//this._data = data;


			this._nodes = data.node;
			this._ways = data.way;
			this._relations = data.relation;
		} else {
			// TODO: check if this functionality works
			// Else, merge the two.
			
			B.Util.arrayMerge(this._nodes, data.node);
			B.Util.arrayMerge(this._ways, data.way);
			B.Util.arrayMerge(this._relations, data.relation);

		}
	},
	get: function (feature) {
		// TODO: atm, this gets everything with the key highway. We should be 
		// checking for highway values that correspond to roads
		var featureData = [];
		var self = this;


		switch (feature) {
		case 'roads':
			var roadValues = ['motorway', 'motorway_link', 'trunk', 'trunk_link',
				'primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary',
				'tertiary_link', 'residential', 'unclassified', 'service', 'track'];
			this._ways.forEach(function (way) {
				// TODO: Clean this up to use _normalizeTagsArray
				var tags = self._normalizeTagsArray(way.tag);
				var tagVal = self._getTagValue(tags, 'highway');

				if (roadValues.indexOf(tagVal) > -1) { // If roadValues contains tagVal
					featureData.push(way);
				}
			});
			break;
		}

		return featureData;
	},
	_getTagValue: function (tags, key) {
		// Search through the tags for the given key.
		// If found, return it. If not, return null
		var self = this;
		var nTags = this._normalizeTagsArray(tags);

		for (var i = 0; i < nTags.length; i++) {
			if (self._KVmatches(nTags[i], key)) {
				return nTags[i]['@v'];
			}
		}
		return null;
	},
	_hasTag: function (tags, key, value) {
		// Search through tags for a key/value pair
		// If value is omitted, simply check if key is defined

		// If found 

		// TODO: Clean this up to use _normalizeTagsArray
		var self = this;

		var nTags = this._normalizeTagsArray(tags);
		// Loop over the array of tag objects
		for (var i = 0; i < nTags.length; i++) {
			if (self._KVmatches(nTags[i], key, value)) {
				return true;
			}
		}
		return false;
	},
	_KVmatches: function (tag, key, value) {
		return tag['@k'] === key && (typeof value === 'undefined' || tag['@v'] === value);
	},
	_normalizeTagsArray: function (tags) {
		if (tags instanceof Array) {
			// If it's an array, we're done.
			return tags;
		} else if (typeof tags === 'undefined') {
			// Handle the case where there are no tags
			return [];
		} else {
			// I *think* the only other case is where tags is a single tag object.
			// In this case, return an array with tags in it
			return [tags];
		}
	}
});

B.osmdata = function (id, options) {
	return new B.OSMDataContainer(id, options);
};