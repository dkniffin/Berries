/* 
 * B.OSMDataContainer is reads in OSM data in JSON format, and allows 
 * access to various data (eg: roads, buildings, etc)
 */

B.OSMDataContainer = B.Class.extend({
	options: {

	},
	initialize: function (data, options) {
		options = B.setOptions(this, options);

		this.addData(data);
		return this;
	},
	addTo: function (model) {
		// Loop over things to render, and start 
	},
	addData: function (data) {
		if (!this._data) {
			// If the data doesn't already exist, simply add it
			this._data = data;
		} else {
			// TODO: check if this functionality works
			// Else, merge the two.
			// Algorithm taken from jQuery's merge function
			var len = +data.length,
				j = 0,
				i = this._data.length;

			for (; j < len; j++) {
				this._data[i++] = data[j];
			}
			this._data.length = i;
		}
	},
	getRoads: function () {
		// TODO: atm, this gets everything with the key highway. We should be 
		// checking for highway values that correspond to roads
		var roads = [];
		var self = this;
		this._data.way.forEach(function (way) {
			if (self._checkTags(way.tag, 'highway')) {
				roads.push(way);
			}
		});
		return roads;
	},
	_checkTags: function (tags, key, value) {
		// Search through tags for a key/value pair
		// If value is omitted, simply check if key is defined
		var self = this;
		if (!tags) {
			// Handle the case where there are no tags
			return false;
		} else if (typeof tags['@k'] !== 'undefined') {
			// Handle the case where tags is a single object instead of an array
			return self._hasKV(tags, key, value);
		} else {
			// Loop over the array of tag objects
			for (var i = 0; i < tags.length; i++) {
				if (self._hasKV(tags[i], key, value)) {
					return true;
				}
			}
		}
		return false;
	},
	_hasKV: function (tag, key, value) {
		return tag['@k'] === key && (typeof value === 'undefined' || tag['@v'] === value);
	}
});

B.osmdata = function (id, options) {
	return new B.OSMDataContainer(id, options);
};