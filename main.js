$(document).ready(function() {
    main.Init();
});

var main = {};

main.Init = function() {
    main.width    = $("#ruler")[0].clientWidth;
    main.height   = main.width * 9 / 16;
    main.renderer = new THREE.WebGLRenderer({
        canvas: $("#canvas")[0],
        antialias: true
    });
    main.renderer.setSize(main.width, main.height);
    main.camera = new THREE.PerspectiveCamera(45, main.width / main.height, 0.1, 1000);
    main.camera.position.z = 5;
    main.scene = new THREE.Scene();
    main.clock = new THREE.Clock();

    $("#btnFullscr").click(main.OnFullscr);
    $(window).resize($.throttle(300, main.OnResize));
    phys.Init(main.scene);
    visu.Init(main.scene);
    main.Render();
}

main.OnFullscr = function() {
    $("#canvas").fullScreen(true);
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
}
