// 2. Initiate Basemap

token = 'pk.eyJ1IjoiZmFiaGlhbnRvIiwiYSI6ImNrNTZoOGt4aTE1MjAza3I1dm8zZ3FqN2QifQ.uz2wPJx8bHo-jEyodlwIGg'
mapbox = 'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
var
    Grayscale = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{key}/{z}/{x}/{y}.png', {
        key: 'lrqdo.me2bng9n',
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    Mapbox = L.tileLayer(mapbox, {
        maxZoom: 19,
        id: 'mapbox.light',
        accessToken: token,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }),
    Streets = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });


// 1. INITIATE MAP 

var mymap = L.map('mapid', {
    center: [0, 0],
    zoom: 0,
    layers: [Streets]
}).setView([54, -116.8456], 3)


// Data TEST

var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]);


// Basemap Controller

var overlayMaps = {
    "Cities": cities,
};


var basemaps = {
    "Grayscale": Grayscale,
    "Mapbox": Mapbox,
    "OpenTopo": OpenTopoMap,
    "Streets": Streets,
}

var drawnControl = {
    "drawnItems ": drawnItems
}

L.control.layers(basemaps).addTo(mymap);

// mouse position tracker

L.control.mousePosition().addTo(mymap);

var latlng = L.latLng(50.5, 30.5);

// Get user location

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('no geolocation provided')
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    L.marker([lat, lng]).addTo(mymap).bindPopup("test").openPopup()

    mymap.flyTo([lat, lng], 9)
}

// DRAWER toolbar (SVG Spritesheet error)
var drawnItems = new L.FeatureGroup();

mymap.addLayer(drawnItems)

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});


mymap.on(L.Draw.Event.CREATED,

    function drawSomething(e) {
        var type = e.layerType,
            layer = e.layer;
        if (type === 'marker') {
            // Do marker specific actions
        }
        // Do whatever else you need to. (save to db; add to map etc)
        mymap.addLayer(layer);
    });


// ?????

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
        d > 50 ? '#FD8D3C' :
        d > 20 ? '#FEB24C' :
        d > 10 ? '#FED976' :
        '#FFEDA0';
}

var geojson

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    })

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' :
        'Hover over a state');
};

info.addTo(mymap);

geojson = L.geoJson(statesData, { style: style, onEachFeature: onEachFeature }).addTo(mymap);

// LEGEND

var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);

// Wicketing

var wicket = new Wkt.Wkt();
var yuhu = []
for (var i = 0; i < wkt_geom.length; i++) {
    x = wkt_geom[i]['SHAPE']
    yuhu.push(x)
}

wicket.read(yuhu)

var feature = wicket.toObject();
drawnItems.addLayer(feature);


// draw to DB

wkt_str = ""
mymap.on('draw:created', function(e) {

    var layer = e.layer;

    var input_json = layer.toGeoJSON()

    var geometry = input_json.geometry.type
    var coordinates = input_json.geometry.coordinates

    if (geometry == 'Polygon') {
        wkt_str = geometry + '(' +
            coordinates.map(function(ring) {
                return '(' + ring.map(function(p) {
                    return p[0] + ' ' + p[1];
                }).join(', ') + ')';
            }).join(', ') + ')';
    } else if (geometry == 'LineString') {
        wkt_str = geometry + '(' +
            coordinates.map(function(ring) {
                return ring[0] + ' ' + ring[1]
            }).join(', ') + ')';
    } else if (geometry == 'Point') {
        wkt_str = geometry + '(' + coordinates[0] + ' ' + coordinates[1] + ')';
    } else {
        return wkt_str = ""
    }
    document.getElementById("manualobj").value = JSON.stringify(manualobj);
    document.getElementById("shape2").value = wkt_str;
    document.getElementById("shpdownload").value = wkt_str;
});

var db_layer = new L.featureGroup();
mymap.addLayer(db_layer)
var overlay = {
    shp: db_layer
}
var args;
var args2;
// from db to map
function addToMap() {
    shp = document.getElementById('addform').value

    var dats

    for (i = 0; i < geodb.length; i++) {
        if (geodb[i]['nama'] == shp) {
            dats = geodb[i]
        }
    }
    nama = dats['nama']

    var wicket = new Wkt.Wkt();

    wicket.read(dats['SHAPE'])

    var toFeature = wicket.toObject();
    db_layer.addLayer(toFeature).bindPopup(shp);

    args = db_layer.toGeoJSON();
    args2 = toFeature.toGeoJSON();

    if (!overlay) {
        var overlay = {
            shp: db_layer
        }
    } else {
        alert('else')
    }
    console.log(args2)
    L.control.layers(overlay).addTo(mymap);

    /////////////////////////////////////////////////////////

    function style2(toFeature) {
        return {
            weight: 2,
            opacity: 0.4,
            color: 'grey',
            dashArray: '',
            fillOpacity: 0.1
        }
    }

    var geojson2

    function onEachFeature(toFeature, layer) {
        layer.on({
            mouseover: highlight,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }


    function highlight(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 4,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.5
        })

        info2.update(layer.feature.geometry);
    }

    function resetHighlight(e) {
        geojson2.resetStyle(e.target);
        info2.update();
    }

    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }


    var info2 = L.control();

    info2.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info2'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info2.update = function(props) {
        this._div.innerHTML = '<h4>Added Feature</h4>' + (props ?
            '<b>' + props.type + '</b><br />' :
            'Hover over a Feature');
    };

    info2.addTo(mymap);

    geojson2 = L.geoJson(args2, { style: style2, onEachFeature: onEachFeature }).addTo(mymap);

}

function downloadAsSHP() {
    wkt = document.getElementById('shape2').value



}