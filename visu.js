var visu = {};

visu.Init = function(scene, pickingScene) {
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var cubes = new THREE.Object3D();
    scene.add(cubes); // scene.children[0]
    for (var i = 0; i < 10; ++i) {
        var mat  = new THREE.MeshLambertMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geom, mat);
        cube.originalColor = "green";
        cube.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
        cube.rotation.z = Math.random() * 3;
        cubes.add(cube);
    }      
    planets = new THREE.Object3D();
    pickingPlanets = new THREE.Object3D();
    scene.add(planets); // scene.children[1]

    var geometry = new THREE.SphereGeometry(1, 10, 10);
    var material = new THREE.MeshBasicMaterial({
        color:      "red",
        transparent: true,
        wireframe:   true,
        opacity:      0.0
    });
    var selectionSphere = new THREE.Mesh(geometry,material);
    scene.add(selectionSphere);

    for (var i=0; i<10; ++i) {
        var planetSize = 0.5;
        var planetColor = "red";
        var geometry = new THREE.SphereGeometry(planetSize, 32, 32);
        var material = new THREE.MeshBasicMaterial({color: planetColor});
        var planet   = new THREE.Mesh(geometry,material);
        planet.position.set(randInt(-10,10), randInt(-5,5), randInt(-5,5));
        var pickingGeometry = new THREE.SphereGeometry(planetSize*2, 32, 32);
        var pickingPlanet   = new THREE.Mesh(pickingGeometry,material);
        pickingPlanet.position.set(planet.position.x, planet.position.y, planet.position.z);
        //planet.id = i;
        planets.add(planet);
        pickingScene.add(pickingPlanet);

        /*var textGeom = new THREE.TextGeometry(randInt(1,50), {
            size: 10,
            height: 1
        });
        var textMat = new THREE.MeshBasicMaterial( {color: "white"} );
        mesh = new THREE.Mesh( textGeom, textMat );
        mesh.position.set(planet.position.x-5,planet.position.y+15,planet.position.z)
        scene.add( mesh );*/
    }

    var directions  = ["xpos", "xneg", "ypos", "yneg", "zneg", "zpos"];
    var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);    
    var materialArray = [];
    for (var i = 0; i < 6; ++i) {
        materialArray.push(new THREE.MeshBasicMaterial({
            map:  THREE.ImageUtils.loadTexture( "img/" + directions[i] + ".png" ),
            side: THREE.BackSide
        }));
    }
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);

    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);
}
