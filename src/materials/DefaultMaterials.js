// Colored Materials
B.Materials.addMaterial('BRICKRED', new THREE.MeshPhongMaterial({color: 0x841F27, side: THREE.DoubleSide }));
B.Materials.addMaterial('SANDSTONEBROWN', new THREE.MeshPhongMaterial({color: 0xC19F77, side: THREE.DoubleSide }));
B.Materials.addMaterial('CONCRETEWHITE', new THREE.MeshPhongMaterial({color: 0xF2F2F2, side: THREE.DoubleSide }));
B.Materials.addMaterial('GLASSBLUE', new THREE.MeshPhongMaterial({color: 0x009DDD, side: THREE.DoubleSide }));
B.Materials.addMaterial('ASPHALTGREY', new THREE.MeshPhongMaterial({color: 0x757575, side: THREE.DoubleSide }));
B.Materials.addMaterial('WOODBROWN', new THREE.MeshPhongMaterial({color: 0xAE8F60, side: THREE.DoubleSide }));
B.Materials.addMaterial('ROOFTILERED', new THREE.MeshPhongMaterial({color: 0xC9555C, side: THREE.DoubleSide }));

// Textured Materials
var texture = THREE.ImageUtils.loadTexture(B.Util.getTexturePath() + '/sandstone_seamless.jpg');
//var widthOfTexture = 50; // meters
//var heightOfTexture = 50; // meters
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//texture.repeat.set(10, 10);

B.Materials.addMaterial('SANDSTONE', new THREE.MeshPhongMaterial({
	map: texture,
	side: THREE.DoubleSide
}));