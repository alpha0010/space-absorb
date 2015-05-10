var enem = {};

enem.Init = function(unitGroup, planetGroup) {
    enem.objGrp    = unitGroup;
    enem.planetGrp = planetGroup;
    enem.lastAct   = 0;
}

enem.MeasurePlanets = function() {
    var planets = enem.planetGrp.children;
    for (var i = 0; i < planets.length; ++i) {
        var planet = planets[i];
        planet.distOrder = [];
        for (var j = 0; j < planets.length; ++j)
            planet.distOrder[j] = j;
        planet.distOrder.sort(function(a, b) {
            var distA = planet.position.distanceToSquared(planets[a].position);
            var distB = planet.position.distanceToSquared(planets[b].position);
            return distA - distB;
        });
    }
}

enem.Update = function(delta) {
    enem.lastAct += delta;
    if (enem.lastAct < 5)
        return;
    enem.lastAct = 0;

    var planets = enem.planetGrp.children;
    if (planets.length == 0)
        return;
    if (!("distOrder" in planets[0]))
        enem.MeasurePlanets();

    var objs = enem.objGrp.children;
    var targPlanet   = 0;
    var targStrength = 9000; // not really...
    for (var i = 0; i < planets.length; ++i) {
        var planet = planets[i];
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

    targStrength    = Math.floor(targStrength * 1.9) + 15;
    var ownStrength = 0;
    for (var i = 0; i < objs.length; ++i) {
        if (objs[i].player != "human")
            ++ownStrength;
    }
    if (targStrength * 1.1 > ownStrength)
        return;

    for (var i = 0; i < targPlanet.distOrder.length; ++i) {
        var planet = planets[targPlanet.distOrder[i]];
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
