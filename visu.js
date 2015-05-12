/* visu.js handles creating objects and adding them to the scene.
Micah Ng and Daniel Dehoog 
For final project of CS 352 at Calvin college
*/

var visu = {};

visu.Init = function(scene, pickingScene) {
    planetNormalMap = THREE.ImageUtils.loadTexture("img/rockNorm.jpg");
    var loader = new THREE.ColladaLoader();
    var cubes = new THREE.Object3D();
    var planets = new THREE.Object3D();
    loader.load("./spaceship.dae", function (collada){
        visu.spaceship = collada.scene.children[2].children[0];
        visu.spaceship.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        visu.InitPlanets(scene, pickingScene, cubes, planets);
    });
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    
    
    scene.add(cubes); // scene.children[0]
    for (var i = 0; i < 0; ++i) {
        var mat  = new THREE.MeshLambertMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geom, mat);
        cube.originalColor = "green";
        cube.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
        cube.rotation.z = Math.random() * 3;
        cubes.add(cube);
    }      
    
    scene.add(planets); // scene.children[1]

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

    scene.add(new THREE.AmbientLight(0x333333));
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);
}

visu.InitPlanets = function(scene, pickingScene, cubes, planets){
    for (var i=0; i<10; ++i) {
        var planetSize = 0.5;
        var planetColor = "red";
        var geometry = new THREE.SphereGeometry(planetSize, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: planetColor});
        material.normalMap = planetNormalMap;
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
            var mat  = new THREE.MeshPhongMaterial({color: color});
            var cube = new THREE.Mesh(visu.spaceship.geometry, mat);
            cube.scale.set(0.08,0.08,0.08);
            cube.position.copy(planet.position);
            cube.player = planet.player;
            cube.originalColor = color;
            cubes.add(cube);
            phys.GoTo([cube], planet.position);
        }
    }
}

visu.AddUnits = function(scene) {
    var geom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    scene.children[1].children.forEach(function(planet){
            var color = (planet.player == "human") ? 0x00FF00 : 0xFFFF00;
            var mat   = new THREE.MeshPhongMaterial({color: color});
            var cube = new THREE.Mesh(visu.spaceship.geometry, mat);
            cube.scale.set(0.08,0.08,0.08);
            cube.position.copy(planet.position);
            cube.player = planet.player;
            cube.originalColor = color;
            scene.children[0].add(cube);
            phys.GoTo([cube], planet.position);
    });
}

visu.DrawText = function(strs, scene, camera) {
    var canv = document.createElement("canvas");
    canv.width  = 1024;
    canv.height = 512;
    var ctx  = canv.getContext("2d");
    ctx.font = "Bold 100px Georgia";
    ctx.fillStyle = "rgb(200,200,200)";
    for (var i = 0; i < strs.length; ++i)
        ctx.fillText(strs[i], 0, 100 + 110*i);
    var texture = new THREE.Texture(canv);
    texture.needsUpdate = true;
    var mat = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false
    });
    var sprite = new THREE.Sprite(mat);
	sprite.scale.set(8, 4, 1.0);
	sprite.position.set(0, 0, 0);
    var camPos = camera.position;
    var lookAtVector = new THREE.Vector3(0,0,-1);
    lookAtVector.applyQuaternion(camera.quaternion);
    sprite.position.set(camPos.x+lookAtVector.x*10, camPos.y+lookAtVector.y*10, camPos.z+lookAtVector.z*10);
    scene.add(sprite);
}
