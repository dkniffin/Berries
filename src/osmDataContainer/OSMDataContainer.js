/* 
 * B.OSMDataContainer is reads in OSM data in JSON format, and allows 
 * access to various data (eg: roads, buildings, etc)
 */

B.OSMDataContainer = B.Class.extend({
	_nodes: [],
	_ways: [],
	_relations: [],
	options: {
		render: [/*'roads', */'buildings'/*, 'fire_hydrants'*/],
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

			var way, node;
			switch (feature) {
			case 'roads':
				var roads = this.get('roads');
				var roadSet = new B.roadset();
				for (var roadI in roads) {
					way = roads[roadI];
					
					roadSet.addObject(new B.Road(way, this, model));
				}
				roadSet.addTo(model);
				break;
			case 'buildings':
				var buildings = this.get('buildings');
				var bldgSet = new B.buildingset();
				for (var bId in buildings) {
					way = buildings[bId];
					//nodes = this.getNodesForWay(way);

					bldgSet.addObject(new B.Building(way, this, model));
				}
				bldgSet.addTo(model);
				break;
			case 'fire_hydrants':
				var fhs = this.get('fire_hydrants');
				for (var fhId in fhs) {
					node = fhs[fhId];
					//nodes = this.getNodesForWay(way);

					new B.FireHydrant(node).addTo(model);
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
		var nodeid, node;
		// /var relid, rel;

		switch (feature) {
		case 'roads':
			var roadValues = ['motorway', 'motorway_link', 'trunk', 'trunk_link',
				'primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary',
				'tertiary_link', 'residential', 'unclassified', 'service', 'track'];
			for (wayid in this._ways) {
				way = this._ways[wayid];
				if (!way.tags) {
					continue;
				}

				if (roadValues.indexOf(way.tags.highway) > -1) { // If roadValues contains tagVal
					features.push(way);
				}
			}
			break;
		case 'buildings':
			// TODO: Add relations
			for (wayid in this._ways) {
				way = this._ways[wayid];
				if (!way.tags) {
					continue;
				}

				var building = way.tags.building;
				if (building && building !== 'no') {
					features.push(way);
				}
			}
			break;
		case 'fire_hydrants':
			for (nodeid in this._nodes) {
				node = this._nodes[nodeid];
				if (!node.tags) {
					continue;
				}

				var emergency = node.tags.emergency;
				if (emergency && emergency === 'fire_hydrant') {
					features.push(node);
				}
			}
			break;
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