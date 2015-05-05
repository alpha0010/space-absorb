var enem = {};

enem.Init = function(unitGroup, planetGroup) {
    enem.objGrp  = unitGroup;
    enem.planets = planetGroup.children;
    enem.lastAct = 0;

    for (var i = 0; i < enem.planets.length; ++i) {
        var planet = enem.planets[i];
        planet.distOrder = [];
        for (var j = 0; j < enem.planets.length; ++j)
            planet.distOrder[j] = j;
        planet.distOrder.sort(function(a, b) {
            var distA = planet.position.distanceToSquared(enem.planets[a].position);
            var distB = planet.position.distanceToSquared(enem.planets[b].position);
            return distA - distB;
        });
    }
}

enem.Update = function(delta) {
    enem.lastAct += delta;
    if (enem.lastAct < 10)
        return;
    enem.lastAct = 0;

    var objs = enem.objGrp.children;
    var targPlanet   = 0;
    var targStrength = 9000; // not really...
    for (var i = 0; i < enem.planets.length; ++i) {
        var planet = enem.planets[i];
        if (planet.player != "human")
            continue;
        var curStrength = 0;
        for (var j = 0; j < objs.length; ++j) {
            var obj = objs[j];
            if (obj.player != "human")
                continue;
            if (obj.dest.equals(planet.position))
                ++curStrength;
        }
        if (curStrength < targStrength) {
            targPlanet   = planet;
            targStrength = curStrength;
        }
    }

    targStrength    = Math.floor(targStrength * 1.2) + 10;
    var ownStrength = 0;
    for (var i = 0; i < objs.length; ++i) {
        if (objs[i].player != "human")
            ++ownStrength;
    }
    if (targStrength * 2 > ownStrength)
        return;

    for (var i = 0; i < targPlanet.distOrder.length; ++i) {
        var planet = enem.planets[targPlanet.distOrder[i]];
        for (var j = 0; j < objs.length; ++j) {
            var obj = objs[j];
            if (obj.player != "human" && obj.dest.equals(planet.position)) {
                obj.dest = targPlanet.position;
                --targStrength;
                if (targStrength <= 0)
                    return;
            }
        }
    }
}
