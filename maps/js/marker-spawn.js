
var map = L.map( 'map', {
  center: [40.0, -100.0],
  minZoom: 4,
  zoom: 4
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 subdomains: ['a','b','c']
}).addTo( map );

var myURL = jQuery( 'script[src$="marker-initialize.js"]' ).attr( 'src' ).replace( 'marker-initialize.js', '' );

var myIcon = L.icon({
  iconUrl: myURL + '../images/pin48_test.png',
  iconRetinaUrl: myURL + '../images/pin48_test.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

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

map.addLayer( markerClusters );
