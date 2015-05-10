var visu = {};

visu.Init = function(scene, pickingScene, enem) {
    var loader = new THREE.ColladaLoader();
    //loader.optinos.convertUpAxis = true;
    loader.load("./spaceship.dae", function (collada){
        visu.spaceship = collada.scene.children[2].children[0];
        //visu.speceship.scale.set(0.1,0.1,0.1);
        visu.InitPlanets(scene, pickingScene, enem);
    })
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    cubes = new THREE.Object3D();
    
    scene.add(cubes); // scene.children[0]
    for (var i = 0; i < 0; ++i) {
        var mat  = new THREE.MeshLambertMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geom, mat);
        cube.originalColor = "green";
        cube.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
        cube.rotation.z = Math.random() * 3;
        cubes.add(cube);
    }      
    planets = new THREE.Object3D();
    scene.add(planets); // scene.children[1]
    pickingPlanets = new THREE.Object3D();

    var geometry = new THREE.SphereGeometry(1, 10, 10);
    var material = new THREE.MeshBasicMaterial({
        color:      "red",
        transparent: true,
        wireframe:   true,
        opacity:      0.0
    });
    var selectionSphere = new THREE.Mesh(geometry,material);
    scene.add(selectionSphere); // scene.children[2]
    

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

visu.InitPlanets = function(scene, pickingScene, enem){
    for (var i=0; i<10; ++i) {
        var planetSize = 0.5;
        var planetColor = "red";
        var geometry = new THREE.SphereGeometry(planetSize, 32, 32);
        var material = new THREE.MeshBasicMaterial({color: planetColor});
        var planet   = new THREE.Mesh(geometry,material);
        planet.position.set(randInt(-10,10), randInt(-5,5), randInt(-5,5));
        planet.player = (i<5) ? "human" : "neutral";
        planet.power  = 10;
        planet.color  = (planet.player == "human") ? 0x0000FF : 0x00FF00;
        planet.material.color.setHex(planet.color);
        var pickingGeometry = new THREE.SphereGeometry(planetSize*2, 32, 32);
        var pickingPlanet   = new THREE.Mesh(pickingGeometry,material);
        pickingPlanet.position.set(planet.position.x, planet.position.y, planet.position.z);
        planets.add(planet);
        pickingScene.add(pickingPlanet);


        for (var j = 0; j <10; ++j) {
            var color = (planet.player == "human") ? 0x00FF00 : 0xFFFF00;
            var mat  = new THREE.MeshLambertMaterial({color: color});
            var cube = new THREE.Mesh(visu.spaceship.geometry, mat);
            cube.scale.set(0.08,0.08,0.08);
            cube.position.copy(planet.position);
            cube.player = planet.player;
            cube.originalColor = color;
            cubes.add(cube);
            phys.GoTo([cube], planet.position);
        }
    }
    
    enem.Init(scene.children[0], scene.children[1]);
    
}

visu.AddUnits = function(scene) {
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    scene.children[1].children.forEach(function(planet){
            var color = (planet.player == "human") ? 0x00FF00 : 0xFFFF00;
            var mat   = new THREE.MeshLambertMaterial({color: color});
            var cube = new THREE.Mesh(visu.spaceship.geometry, mat);
            cube.scale.set(0.08,0.08,0.08);
            cube.position.copy(planet.position);
            cube.player = planet.player;
            cube.originalColor = color;
            scene.children[0].add(cube);
            phys.GoTo([cube], planet.position);
    });
};
