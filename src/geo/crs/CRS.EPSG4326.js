/*
 * B.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

B.CRS.EPSG4326 = B.extend({}, B.CRS, {
	code: 'EPSG:4326',

	projection: B.Projection.LonLat,
	transformation: new B.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
});
