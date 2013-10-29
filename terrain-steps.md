Steps to create terrain files
=============================
http://blog.thematicmapping.org/2013/10/terrain-building-with-threejs-part-1.html
- Get the data
 - SRTM HGT files
- Convert the hgt to a useable ENVI binary heightmap
 - Build a vrt file that references the data
    gdalbuildvrt boulder_plus.vrt N39W106.HGT N40W106.HGT
 - Create a geotiff out of it (NOTE: This part might be wrong; we might want to clip eventually)
    gdalwarp boulder_plus.vrt boulder_plus.tif
 - Look at the info for the geotiff to get params for next command
    gdalinfo -mm boulder_plus.tif
 - create an ENVI bin file. this is more precise than the png
    gdal_translate -scale 0 4347 0 65535 -outsize 50% 50% -of ENVI boulder_plus.tif boulder_plus.bin
- Add to Berries via:
 terrain = B.terrain('data/boulder_plus.bin', new B.LatLngBounds([[39.0,-106.0],[41.0,-105.0]])).addTo(model);
