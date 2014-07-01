var turf = require("turf"),
    _ = require("underscore"),
    fs   = require("fs"),
    base = 'geojson',
    args = process.argv.splice(2),
    market = _.last(args),
    threeZips = _.initial(args);

(function() {
    var polygons = [];
    for(var i in threeZips) {
        var name = threeZips[i] + "";
        if (name.length == 1) {
            name = "00" + name;
        }
        if (name.length == 2) {
            name = "0" + name;
        }
        console.log('Testing ' + name);
        if (fs.existsSync(base+'/'+name+'.geojson')) {
            console.log(' - found file for '+base + '/' + name + '.geojson');
            var g = fs.readFileSync(base+'/'+name+'.geojson');
            var polygon;
            try {
                polygon = JSON.parse(g);
                polygons.push(polygon);
            } catch(e) {
                console.log("BAD JSON: " + name);
            }
        }
    }

    var f = {
        type: "FeatureCollection",
        features: _.flatten(_.pluck(polygons, "features"))
    };
    console.log(f);
    var combine = turf.combine(f);
    console.log(' - merged ' + name);
    fs.writeFileSync(base+'/'+market, JSON.stringify(combine));

    console.log(' - wrote ' + name);
    console.log('');
    console.log('==========');
    console.log('');
})();
