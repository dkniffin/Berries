
B.CRS.EPSG3395 = B.extend({}, B.CRS, {
	code: 'EPSG:3395',

	projection: B.Projection.Mercator,

	transformation: (function () {
		var m = B.Projection.Mercator,
		    r = m.R_MAJOR,
		    r2 = m.R_MINOR;

		return new B.Transformation(0.5 / (Math.PI * r), 0.5, -0.5 / (Math.PI * r2), 0.5);
	}())
});
