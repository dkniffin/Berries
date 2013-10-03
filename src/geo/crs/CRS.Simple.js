/*
 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
 */

B.CRS.Simple = B.extend({}, B.CRS, {
	projection: B.Projection.LonLat,
	transformation: new B.Transformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	}
});
