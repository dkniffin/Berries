var deps = {
	Core: {
		src: ['Berries.js',
		      'core/Util.js',
		      'core/Class.js',
		      'core/Browser.js',
		      'worker/Worker.js',
		      'worker/WebWorkerGeometryHelper.js',
		      'core/Logger.js',
		      'core/Premades.js',
		      'materials/Material.js',
		      'materials/DefaultMaterials.js',
		      'geometry/Point.js',
		      'geometry/Transformation.js',
		      'dom/DomUtil.js',
		      'dom/DomEvent.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js',
		      'geo/projection/Projection.js',
		      'geo/projection/Projection.SphericalMercator.js',
		      'geo/projection/Projection.LonLat.js',
		      'geo/crs/CRS.js',
		      'geo/crs/CRS.Simple.js',
		      'geo/crs/CRS.EPSG3857.js',
		      'geo/crs/CRS.EPSG4326.js',
		      'control/DefaultControl.js',
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
	},
	
	Objects : {
		src: ['objects/Building.js',
			  'objects/Road.js',
			  'objects/FireHydrant.js',
			  'objects/Tree.js'],
		desc: 'Various objects to add to the scene.'
	},

	OSMDataContainer: {
		src: ['osmDataContainer/OSMDataContainer.js'],
		desc: 'A class to read in OSM data in JSON format, and output various types of data (eg: roads, buildings, etc).',
		deps: ['Objects']
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
