// Defines viewing boundary around contiguous US

var maxBounds = L.latLngBounds(
    L.latLng(-55.499550, -150.276413), //Southwest
    L.latLng(83.162102, -52.233040)  //Northeast
);

// Initializes map

var map = L.map( 'map', {
  center: [40.0, -100.0],
  minZoom: 4,
  zoom: 4,
  'maxBounds': maxBounds
}).fitBounds(maxBounds);

// Superimposes openstreetmap over screen

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 subdomains: ['a','b','c']
}).addTo( map );

// Defines state outlines

function getColor(d) {
    return d > 30 ? 'rgba(7, 65, 121,0.9)' :
           d > 20  ? 'rgba(7, 65, 121,0.9)' :
           d > 15  ? 'rgba(10, 85, 158,0.9)' :
           d > 10  ? 'rgba(10, 85, 158,0.9)' :
           d > 5   ? 'rgba(67, 132, 194,0.9)' :
           d > 1   ? 'rgba(148, 190, 231,0.9)' :
           d > 0   ? 'rgba(199, 223, 247,0.9)' :
                      'rgba(265,265,265,1)';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.membership),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Info state control

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>HSDA State Chapters</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.membership + ' local chapters'
        : 'Hover over a state');
};

info.addTo(map);

// Highlight state on hover

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

var geojson;

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Custom legend control

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our membership intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

// Superimposes state effects onto map

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


// Defines markers

var myURL = jQuery( 'script[src$="marker-initialize.js"]' ).attr( 'src' ).replace( 'marker-initialize.js', '' );

var myIcon = L.icon({
  iconUrl: myURL + '../images/pin48.png',
  iconRetinaUrl: myURL + '../images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

// Adds pop-ups to markers

for ( var i = 0; i < markers.length; ++i )
{
  var popup = '<b>Chapter: </b>' + markers[i].Chapter +
              '<br/><b>Location: </b>' + markers[i].City + ", " + markers[i].State +
              '<br/><b>Type:</b> ' + markers[i].Type +
              '<br/><b>Point of Contact:</b> ' + markers[i].FName + " " + markers[i].LName +
              '<br/><b>Title:</b> ' + markers[i].Title +
              '<br/><b>Email:</b> ' + '<a href=mailto:' + markers[i].Email + '>' + markers[i].Email + '</a>' +
              '<br/><b>Phone:</b> ' + markers[i].Phone;  

  var m = L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon} )
                  .bindPopup( popup );

  markerClusters.addLayer( m );
}

// Superimposes markers onto map

map.addLayer( markerClusters );
