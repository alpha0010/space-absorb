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
        dir = phys.ValidNorm(dir);
        obj.velocity.add(dir.divideScalar(8));

        for (var j = 0; j < phys.objs.length; ++j) {
            if (i === j)
                continue;
            var objB = phys.objs[j];
            dir = objB.position.clone().sub(obj.position).normalize();
            dir = phys.ValidNorm(dir);
            var distSq = Math.max(0.02, obj.position.distanceToSquared(objB.position));
            obj.velocity.sub(dir.divideScalar(distSq * 800));
        }

        for (var j = 0; j < phys.planets.length; ++j) {
            var planet = phys.planets[j];
            dir = planet.position.clone().sub(obj.position).normalize();
            dir = phys.ValidNorm(dir);
            var distSq = Math.max(0.02, obj.position.distanceToSquared(planet.position));
            obj.velocity.sub(dir.divideScalar(distSq * 20));
        }

        obj.velocity.sub( obj.velocity.clone()
                         .multiply(obj.velocity)
                         .multiply(obj.velocity)
                         .divideScalar(20) );
        obj.position.add(obj.velocity.clone().multiplyScalar(delta));
    }
}

phys.ValidNorm = function(vec) {
    if (   (vec.x === 0 && vec.y === 0 && vec.z === 0)
        || isNaN(vec.x) || isNaN(vec.y) || isNaN(vec.z) ) {
        return new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    }
    return vec;
}
