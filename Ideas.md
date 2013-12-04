Buildings
======
- Height (default: 2 stories < levels < height)
- Roof Shape (default: gable for house, flat for others < tags)
- Surface  (default vinyl for house, metal/glass for others < tags)
- Doors (default: None < connections to footways < tags)
- Other features based on tags (3D tagging)

Topology
======
- Based on SRTM
- Buildings rendered so "center" of 1st level is at ground level
- Roads/Paths "plastered" to topo
- Bridges slope from start ele to end

Roads
====
- Width (default: 1 for service, 2 for residential-primary, 4 for motorway and trunk < lane tag < width tag)
- Surface (default: asphalt < tags
- Vehicles (default density: 50 cars, 1 bus, 2 motorcycles < access tags)
- Traffic (maybe)
- Median (maybe)

Paths
====
- Widths (default: 2m < tags)
- Occupants (default: 50 pedestrians, 5 bicycles, 1 wheelchair < access tags)
- Surface (default: concrete < tags)
- Steps, ramps (slope from start to end)

Trees
====
- Individual trees, forests
- Deciduous, Coniferous

Water
====
- Ripples using textures
- Could depth be incorporated?

Other Features to Render
=================
- Flag Poles
- Fences
- Fire Hydrants
- Bike Parking
- Pitches (Ground markings based on type)


Environmental Effects
==============
- Weather (based on weather API)
- Night/Day (based on time in location)
- Astral bodies (Sun, Moon, Stars) (Is there a good data source for stars?)
- Clouds (Based on weather)
