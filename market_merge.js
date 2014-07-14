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
            var polygon;
            try {
                var zips = JSON.parse(fs.readFileSync(base+'/'+name+'.geojson'));
                polygon = zips.features;
                polygons.push(polygon);
            } catch(e) {
                console.log("BAD JSON: " + name + ": " + e.message);
            }
        }
    }

    var f = {
        type: "FeatureCollection",
        features: _.flatten(polygons)
    };
    var combine = turf.combine(f);
    console.log(' - merged ' + market);
    fs.writeFileSync(base+'/'+market + "_base.geojson", JSON.stringify(f));
    var merged = turf.merge(f);
    fs.writeFileSync(base+'/'+market + "_merged.geojson", JSON.stringify(merged));

    console.log(' - wrote ' + name);
    console.log('');
    console.log('==========');
    console.log('');
})();
