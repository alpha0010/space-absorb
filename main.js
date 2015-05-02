$(document).ready(function() {
    main.Init();
});

var main = {};

function randInt(a,b){
    return a + parseInt(Math.random()*(b-a+1));
}

main.Animate = function() {
    requestAnimationFrame( main.Animate );
    main.controls.update();
    main.Render();
}

main.Init = function() {
    main.width    = $("#ruler")[0].clientWidth;
    main.height   = main.width * 9 / 16;
    main.renderer = new THREE.WebGLRenderer({
        canvas: $("#canvas")[0],
        antialias: true
    });
    main.renderer.setSize(main.width, main.height);
    main.camera = new THREE.PerspectiveCamera(45, main.width / main.height, 1, 15000);
    main.camera.position.z = 20;
    main.scene = new THREE.Scene();
    main.clock = new THREE.Clock();
    main.raycaster = new THREE.Raycaster();
    main.mouse     = new THREE.Vector3();
    main.mouseOrig = new THREE.Vector3();
    main.pickingScene   = new THREE.Scene();
    main.pickingTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    main.pickingTexture.minFilter = THREE.LinearFilter;
    main.pickingTexture.generateMipmaps = false;
    main.selected = [];
    main.selectedPlanet;
    main.selectedUnits = [];
    main.dontDrag = true;

    main.controls = new THREE.TrackballControls(main.camera, main.renderer.domElement);
    main.controls.rotateSpeed = 2.5;
    main.controls.zoomSpeed   = 3;
    main.controls.panSpeed    = 0.8;
    main.controls.noZoom = false;
    main.controls.noPan  = false;
    main.controls.staticMoving = true;
    main.controls.addEventListener( 'change', main.Render );
    main.controls.keys = [ 0, 83, 65, 68 ];

    $("#btnFullscr").click(main.OnFullscr);
    $(window).resize($.throttle(300, main.OnResize));
    $(document).mousemove(main.OnMouseMove);
    $(document).mousedown(main.OnMouseDown);
    $(document).mouseup(main.OnMouseUp);
    $(document).keydown(main.OnKeyDown);
    main.mouseDown = false;
    main.didDrag   = false;
    visu.Init(main.scene, main.pickingScene);
    phys.Init(main.scene.children[0], main.scene.children[1]);
    main.Animate();  
    window.setInterval(function(){visu.AddUnits(main.scene)},10000);
}

main.OnFullscr = function() {
    $("#canvas").fullScreen(true);
}

main.OnKeyDown = function(event) {
    if (event.keyCode == 32) {
        event.preventDefault();
        main.selectedUnits.forEach(function(unit) {
            unit.material.color.setStyle(unit.originalColor);
        });
        main.selectedUnits = [];
    }
}

main.OnMouseDown = function(event) {
    event.preventDefault();
    if (event.which != 1) // only want left click
        return;
    main.mouseDown = true;
    main.didDrag   = false;
    main.dontDrag  = true;
    var offset = $("#canvas").offset();
    main.mouseOrig.x = (event.pageX - offset.left)/main.width * 2 - 1;
    main.mouseOrig.y = -(event.pageY - offset.top)/main.height * 2 + 1;
    main.mouseOrig.z = 0;
    if (main.selectedPlanet) {
        var pos = main.selectedPlanet.position;
        main.scene.children[2].position.copy(pos);
    }
}

main.OnMouseMove = function(event) {
    var offset = $("#canvas").offset();
    main.mouse.x = (event.pageX - offset.left)/main.width * 2 - 1;
    main.mouse.y = -(event.pageY - offset.top)/main.height * 2 + 1;
    main.mouse.z = 0;
    main.dontDrag = main.mouse.distanceTo(main.mouseOrig) < 0.05 && main.dontDrag;
    main.mouse.unproject(main.camera);

    if (!main.mouseDown) {
        main.scene.children[1].children.forEach(function(planet) {
            planet.material.color.setHex(planet.color);
        });

        main.raycaster.set(main.camera.position, main.mouse.sub(main.camera.position).normalize());
        var intersects = main.raycaster.intersectObjects(main.pickingScene.children);

        if (intersects[0]) {
            intersects[0].object.material.color.setRGB(0, 255, 0);
            main.selectedPlanet = intersects[0].object;
        }
        else
            main.selectedPlanet = null;
    }
    else if (main.selectedPlanet && event.button == 0 && !main.dontDrag ) {
        main.didDrag = true;
        var dir = main.mouse.sub( main.camera.position ).normalize();
        var distance = - (main.camera.position.z-main.selectedPlanet.position.z) / dir.z;
        var pos = main.camera.position.clone().add( dir.multiplyScalar( distance ) );

        var selectionSphere = main.scene.children[2];
        selectionSphere.material.opacity = 1.0;
        var scale = Math.max(scale = pos.distanceTo(main.selectedPlanet.position),0.51);

        selectionSphere.scale.set(scale,scale,scale);

        main.selectedUnits.forEach(function(unit) {
            unit.material.color.setHex(unit.originalColor);
        });
        main.selectedUnits = [];
        main.scene.children[0].children.forEach(function(unit) {
            if (unit.player == "human" && unit.position.distanceTo(selectionSphere.position) < scale) {
                main.selectedUnits.push(unit);
                unit.material.color.setRGB(255, 0, 0);
            }
        });
    }
}

main.OnMouseUp = function(event) {
    if (event.which != 1)
        return;
    main.mouseDown = false;
    if (main.selectedPlanet && !main.didDrag)
        phys.GoTo(main.selectedUnits, main.selectedPlanet.position);
    var selectionSphere = main.scene.children[2];
    selectionSphere.material.opacity = 0.0;
    main.selectedPlanet = null;
}

main.OnResize = function() {
    if ($(document).fullScreen()) {
        main.width  = $(window).width();
        main.height = $(window).height();
    }
    else {
        main.width  = $("#ruler")[0].clientWidth;
        main.height = main.width * 9 / 16;
    }
    main.camera.aspect = main.width / main.height;
    main.camera.updateProjectionMatrix();
    main.renderer.setSize(main.width, main.height);
    main.controls.handleResize();
}

main.Render = function() {
    phys.Update(main.clock.getDelta());
    main.renderer.render(main.scene, main.camera);
    main.renderer.render(main.pickingScene, main.camera, main.pickingTexture);
}
