/* 
B.OSMDataContainer reads in OSM data in JSON format, and allows access to
various features (eg: roads, buildings, etc). This class also makes calls to
the web worker to generate objects, and creates Berries objects out of them
*/

B.OSMDataContainer = B.Class.extend({
	_nodes: [],
	_ways: [],
	_relations: [],
	_model: null,
	options: {
	},
	initialize: function (data, options) {
		options = B.setOptions(this, options);

		this.addData(data);
		return this;
	},
	addTo: function (model, options) {
		this._model = model;
		var origin = model._origin;

		// For each feature
		for (var feature in options.render) {
			var featureOptions = options.render[feature];
			var id, nodes, i, nodeId;

			// If the options say to skip it, go to the next feature
			if (featureOptions === false) { continue; }

			// Switch on the feature name to deterine how to handle it
			switch (feature) {
			case 'buildings':
				model._logger.log('Generating buildings');

				// Get the OSM data for the feature
				var buildings = this.get('buildings');

				model._logger.log('About to generate ' + buildings.length + ' buildings');

				// For each building
				for (id in buildings) {
					var building = buildings[id];
					nodes = [];

					// Get the OSM nodes for it
					for (i in building.nodes) {
						nodeId = building.nodes[i];
						nodes[i] = this.getNode(nodeId);
					}


					// Make calls to worker to generate objects
					B.Worker.sendMsg({
						action: 'generateBuilding',
						nodes: nodes,
						tags: building.tags,
						origin: origin,
						options: featureOptions
					// When it's done, send the returned data to a callback function
					}, B.BuildingHelper.workerCallback.bind(this));
					
				}
				break;
			case 'roads':
				model._logger.log('Generating roads');

				var roads = this.get('roads');

				model._logger.log('About to generate ' + roads.length + ' roads');

				// For each road
				for (id in roads) {
					var road = roads[id];
					nodes = [];

					for (i in road.nodes) {
						nodeId = road.nodes[i];
						nodes[i] = this.getNode(nodeId);
					}


					// Make calls to worker to generate objects
					B.Worker.sendMsg({
						action: 'generateRoad',
						nodes: nodes,
						tags: road.tags,
						origin: origin,
						options: featureOptions
					// When it's done, send the returned data to a callback function
					}, B.RoadHelper.workerCallback.bind(this));
					
				}
				break;
			case 'fireHydrants':
				model._logger.log('Generating fire hydrants');

				var fhs = this.get('fire_hydrants');

				model._logger.log('About to generate ' + fhs.length + ' fire hydrants');

				for (id in fhs) {
					var node = fhs[id];
					new B.FireHydrant(node, featureOptions).addTo(model);
				}
				break;

			}

		}
		//model.addObject();
	},
	addData: function (data) {
		// Add data to the OSMDataContainer object

		if (!this._data) {
			// If the data doesn't already exist, simply add it

			this._nodes = data.nodes;
			this._ways = data.ways;
			this._relations = data.relations;

			// Deal with a rare bug where an OSM way has only one node
			for (var i in this._ways) {
				if (this._ways[i].nodes.length < 2) {
					delete this._ways[i];
					console.warn('Way ' + i + ' is a bug. It only has one node. Consider deleting it from OSM.');
				}
			}
		} else {
			// Else, merge the two.
			// TODO: check if this functionality works
			
			B.Util.arrayMerge(this._nodes, data.nodes);
			B.Util.arrayMerge(this._ways, data.ways);
			B.Util.arrayMerge(this._relations, data.relations);
		}
	},
	get: function (feature) {
		// Get an OSM feature

		var features = [];
		var wayid, way;
		var nodeid, node;
		// var relid, rel;

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