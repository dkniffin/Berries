/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

B.Projection.LonLat = {
	project: function (latlng) {
		return new B.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new B.LatLng(point.y, point.x);
	}
};
