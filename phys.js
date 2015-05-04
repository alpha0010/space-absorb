var phys = {};

phys.Init = function(unitGroup, planetGroup) {
    phys.objGrp  = unitGroup;
    phys.planets = planetGroup.children;
    phys.dest    = new THREE.Vector3(Math.random()*4-2, Math.random()*2-1, Math.random()*4-2);
}

phys.GoTo = function(units, destination) {
    for (var i = 0; i < units.length; ++i) {
        units[i].dest = destination;
    }
}

phys.Update = function(delta) {
    var objs   = phys.objGrp.children;
    var remIdx = [];
    for (var i = 0; i < objs.length; ++i) {
        if (remIdx.indexOf(i) !== -1)
            continue;

        var obj = objs[i];
        obj.rotation.x += delta / 3;
        obj.rotation.y += delta / 3;

        if (!obj.velocity)
            obj.velocity = new THREE.Vector3();
        if (!obj.dest)
            obj.dest = phys.dest
        var dir = obj.dest.clone().sub(obj.position).normalize();
        dir = phys.ValidNorm(dir);
        obj.velocity.add(dir.divideScalar(8));

        var isDead = false;
        for (var j = 0; j < objs.length; ++j) {
            if (i === j)
                continue;
            var objB = objs[j];
            dir = objB.position.clone().sub(obj.position).normalize();
            dir = phys.ValidNorm(dir);
            var distSq = Math.max(0.02, obj.position.distanceToSquared(objB.position));
            if (obj.player === objB.player)
                obj.velocity.sub(dir.divideScalar(distSq * 800));
            else if (distSq < 0.04 && remIdx.indexOf(j) === -1) {
                // annihilate
                remIdx.push(i);
                remIdx.push(j);
                isDead = true;
                break;
            }
            else
                obj.velocity.add(dir.divideScalar(distSq * 200));
        }
        if (isDead)
            continue;

        for (var j = 0; j < phys.planets.length; ++j) {
            var planet = phys.planets[j];
            var distSq = Math.max(0.02, obj.position.distanceToSquared(planet.position));
            if (planet.player !== obj.player || planet.power < 10) {
                if (distSq < 0.2) {
                    if (planet.player === obj.player)
                        planet.power++;
                    else if (planet.power === 1) {
                        planet.player = obj.player;
                        planet.color  = (planet.player == "human") ? 0x0000FF : 0x999999;
                        planet.material.color.setHex(planet.color);
                    }
                    else
                        planet.power--;
                    remIdx.push(i);
                    isDead = true;
                    break;
                }
                continue; // do not repel
            }
            dir = planet.position.clone().sub(obj.position).normalize();
            dir = phys.ValidNorm(dir);
            obj.velocity.sub(dir.divideScalar(distSq * 20));
        }
        if (isDead)
            continue;

        obj.velocity.sub( obj.velocity.clone()
                         .multiply(obj.velocity)
                         .multiply(obj.velocity)
                         .divideScalar(20) );
        obj.position.add(obj.velocity.clone().multiplyScalar(delta));
    }

    if (remIdx.length > 0) {
        phys.objGrp.children = objs.filter(function(elem, idx) {
            return remIdx.indexOf(idx) === -1;
        });
    }
}

phys.ValidNorm = function(vec) {
    if (   (vec.x === 0 && vec.y === 0 && vec.z === 0)
        || isNaN(vec.x) || isNaN(vec.y) || isNaN(vec.z) ) {
        return new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    }
    return vec;
}
