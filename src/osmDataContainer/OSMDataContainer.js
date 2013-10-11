/* 
 * B.OSMDataContainer is reads in OSM data in JSON format, and allows 
 * access to various data (eg: roads, buildings, etc)
 */

B.OSMDataContainer = B.Class.extend({
	_nodes: [],
	_ways: [],
	_relations: [],
	options: {
		render: ['roads', 'buildings'],
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

			var way;
			switch (feature) {
			case 'roads':
				var roads = this.get('roads');
				for (var roadI in roads) {
					way = roads[roadI];
					
					new B.Road(way, this).addTo(model);
				}
				break;
			case 'buildings':
				var buildings = this.get('buildings');
				for (var bId in buildings) {
					way = buildings[bId];
					//nodes = this.getNodesForWay(way);

					new B.Building(way, this).addTo(model);
				}
				break;
			}
		}
		//model.addObject();
	},
	addData: function (data) {

		if (!this._data) {
			// If the data doesn't already exist, simply add it

			this._nodes = data.nodes;
			this._ways = data.ways;
			this._relations = data.relations;
		} else {
			// TODO: check if this functionality works
			// Else, merge the two.
			
			B.Util.arrayMerge(this._nodes, data.nodes);
			B.Util.arrayMerge(this._ways, data.ways);
			B.Util.arrayMerge(this._relations, data.relations);
		}
	},
	get: function (feature) {
		// TODO: atm, this gets everything with the key highway. We should be 
		// checking for highway values that correspond to roads
		var features = [];
		var wayid, way;

		switch (feature) {
		case 'roads':
			var roadValues = ['motorway', 'motorway_link', 'trunk', 'trunk_link',
				'primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary',
				'tertiary_link', 'residential', 'unclassified', 'service', 'track'];
			for (wayid in this._ways) {
				if (!this._ways[wayid].tags) {
					continue;
				}

				if (roadValues.indexOf(this._ways[wayid].tags.highway) > -1) { // If roadValues contains tagVal
					way = this._ways[wayid];
					features.push(way);
				}
			}
			break;
		case 'buildings':
			// TODO: Add relations
			for (wayid in this._ways) {
				if (!this._ways[wayid].tags) {
					continue;
				}

				var building = this._ways[wayid].tags.building;
				if (building && building !== 'no') {
					way = this._ways[wayid];
					features.push(way);
				}
			}
		}

		return features;
	},
	getNode: function (nodeId) {
		return this._nodes[nodeId];
	},
	getWay: function (wayId) {
		return this._ways[wayId];
	},
	getRelation: function (relId) {
		return this._relations[relId];
	}

});

B.osmdata = function (id, options) {
	return new B.OSMDataContainer(id, options);
};