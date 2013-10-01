var deps = {
	Core: {
		src: ['Berries.js',
		      'core/Util.js',
		      'core/Class.js',
		      'dom/DomUtil.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js',
		      //'geo/projection/Projection.js',
		      //'geo/projection/Projection.SphericalMercator.js',
		      //'geo/projection/Projection.LonLat.js',
		      //'geo/crs/CRS.js',
		      //'geo/crs/CRS.Simple.js',
		      //'geo/crs/CRS.EPSG3857.js',
		      //'geo/crs/CRS.EPSG4326.js',
		      'model/Model.js'],
		desc: 'The core of the library, including OOP, events, DOM facilities, basic units, projections (EPSG:3857 and EPSG:4326) and the base Map class.'
	},

	Terrain: {
		src: ['objects/Terrain.js'],
		desc: 'The base class for rendering terrain data on the model.'
	},
	Light: {
		src: ['objects/Light.js'],
		desc: 'A light source to render in the scene.' 
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
