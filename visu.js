var visu = {};

visu.Init = function(scene) {
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var mat  = new THREE.MeshLambertMaterial({color: 0x00ff00});
    for (var i = 0; i < 10; ++i) {
        var cube = new THREE.Mesh(geom, mat);
        cube.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
        cube.rotation.z = Math.random() * 3;
        scene.add(cube);
    }
    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);
}
