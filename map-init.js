// Initialize the map centered on Charleston, SC
var map = L.map('map', {
	center: [32.7765, -79.9311],
	zoom: 10,
	zoomControl: false,
	preferCanvas: true
});

// OpenStreetMap tile layer
var openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	tileSize: 256,
	zoomOffset: 0,
	detectRetina: true,
	attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.zoom({
    position: 'topright'
}).addTo(map);

var searchControl = L.esri.Geocoding.geosearch({
	position: 'topright'
}).addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function(data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        var marker = L.marker(data.results[i].latlng)
            .addTo(results)
            .on('click', function() {
                // Remove the marker when clicked
                results.removeLayer(this);
            });
    }
});