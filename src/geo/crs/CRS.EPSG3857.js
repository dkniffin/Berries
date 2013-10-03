/*
 * B.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
 * and is used by Leaflet by default.
 */

B.CRS.EPSG3857 = B.extend({}, B.CRS, {
	code: 'EPSG:3857',

	projection: B.Projection.SphericalMercator,
	transformation: new B.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

	project: function (latlng) { // (LatLng) -> Point
		var projectedPoint = this.projection.project(latlng),
		    earthRadius = 6378137;
		return projectedPoint.multiplyBy(earthRadius);
	}
});

B.CRS.EPSG900913 = B.extend({}, B.CRS.EPSG3857, {
	code: 'EPSG:900913'
});
