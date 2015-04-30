var phys = {};

phys.Init = function(unitGroup, planetGroup) {
    phys.objs    = unitGroup.children;
    phys.planets = planetGroup.children;
    phys.dest    = new THREE.Vector3(Math.random()*4-2, Math.random()*2-1, Math.random()*4-2);
}

phys.GoTo = function(units, destination) {
    for (var i = 0; i < units.length; ++i) {
        units[i].dest = destination;
    }
}

phys.Update = function(delta) {
    for (var i = 0; i < phys.objs.length; ++i) {
        var obj = phys.objs[i];
        obj.rotation.x += delta / 3;
        obj.rotation.y += delta / 3;

        if (!obj.velocity)
            obj.velocity = new THREE.Vector3();
        if (!obj.dest)
            obj.dest = phys.dest
        var dir = obj.dest.clone().sub(obj.position).normalize();
        obj.velocity.add(dir.divideScalar(8));

        for (var j = 0; j < phys.objs.length; ++j) {
            if (i === j)
                continue;
            var objB = phys.objs[j];
            dir = objB.position.clone().sub(obj.position).normalize();
            var distSq = Math.max(1e-10, obj.position.distanceToSquared(objB.position));
            obj.velocity.sub(dir.divideScalar(distSq * 600));
        }

        for (var j = 0; j < phys.planets.length; ++j) {
            var planet = phys.planets[j];
            dir = planet.position.clone().sub(obj.position).normalize();
            var distSq = Math.max(1e-10, obj.position.distanceToSquared(planet.position));
            obj.velocity.sub(dir.divideScalar(distSq * 20));
        }

        obj.velocity.sub( obj.velocity.clone()
                         .multiply(obj.velocity)
                         .multiply(obj.velocity)
                         .divideScalar(20) );
        obj.position.add(obj.velocity.clone().multiplyScalar(delta));
    }
}
