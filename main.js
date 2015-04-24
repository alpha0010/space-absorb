$(document).ready(function() {
    main.Init();
});

var main = {};

function randInt(a,b){
    return a + parseInt(Math.random()*(b-a+1));
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
    main.camera.position.z = 30;
    main.scene = new THREE.Scene();
    main.clock = new THREE.Clock();
    main.projector = new THREE.Projector();
    main.raycaster = new THREE.Raycaster();
    main.mouse = new THREE.Vector3();
    main.pickingScene = new THREE.Scene();
    main.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
    main.pickingTexture.minFilter = THREE.LinearFilter;
    main.pickingTexture.generateMipmaps = false;

    $("#btnFullscr").click(main.OnFullscr);
    $(window).resize($.throttle(300, main.OnResize));
    document.addEventListener( 'mousemove', main.OnMouseMove, false );
    visu.Init(main.scene, main.pickingScene);
    phys.Init(main.scene.children[0]);
    main.Render();  
}

main.OnFullscr = function() {
    $("#canvas").fullScreen(true);
}

main.OnMouseMove = function(event) {
    var offset = $("#canvas").offset();
    main.mouse.x = (event.pageX - offset.left)/main.width *2 - 1;
    main.mouse.y = -(event.pageY - offset.top)/main.height *2 + 1;
    
    main.scene.children[1].children.forEach(function(planet){
        planet.material.color.setRGB(0,0,255);
    });
    
    main.mouse.unproject(main.camera);
    main.raycaster.set(main.camera.position, main.mouse.sub(main.camera.position).normalize());
    var intersects = main.raycaster.intersectObjects(main.pickingScene.children);

    //intersects[intersects.length-1].object.material.color.setRGB(0,255,0);
    intersects.forEach(function(intersection){
        intersection.object.material.color.setRGB(0,255,0);
    });
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
}

main.Render = function() {
    requestAnimationFrame(main.Render);
    phys.Update(main.clock.getDelta());
    main.renderer.render(main.scene, main.camera);
    main.renderer.render(main.pickingScene, main.camera, main.pickingTexture);
}
