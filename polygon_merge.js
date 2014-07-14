var turf = require("turf"),
    fs   = require("fs"),
    base = 'geojson',
    i = process.argv.slice(2)[0];

(function() {
    var name = i + "";
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
        var polygons;
        try {
            polygons = JSON.parse(g);
        } catch(e) {
            console.log("BAD JSON: " + name);
        }
        if (polygons.features !== undefined) {
            var merged = turf.merge(polygons);
            console.log(' - merged ' + name);
            merged.properties.GEOID10 = name;
            merged.properties.ZCTA5CE10 = name;
            fs.writeFileSync(base+'/'+name+'_merged.geojson', JSON.stringify(merged));
            console.log(' - wrote ' + name);
        } else {
            console.log(polygons);
        }
        console.log('');
        console.log('==========');
        console.log('');
    }
})();
