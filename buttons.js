// SLIDER CONTROL --------------------------------------------------------------
var opacitySlider = document.getElementById('opacity-slider');
opacitySlider.addEventListener('input', function () {
	var opacityValue = opacitySlider.value;
	imageOverlay.setOpacity(opacityValue);
});

// MOVE CONTROLS ---------------------------------------------------------------

function centerImage() {
	// Get the current map center
	var currentCenter = map.getCenter();

	// Recalculate the image bounds based on the current map center
	var topLeftLat = currentCenter.lat - latLonHeight.latChange / 2;
	var topLeftLon = currentCenter.lng - latLonWidth.lonChange / 2;
	var bottomRightLat = currentCenter.lat + latLonHeight.latChange / 2;
	var bottomRightLon = currentCenter.lng + latLonWidth.lonChange / 2;

	// Set the new position for the image overlay
	imageOverlay.setBounds([[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]]);
}

document.getElementById('center-button').addEventListener('click', centerImage);

// LAYER TOGGLE ----------------------------------------------------------------

document.getElementById('toggle-layer-btn').addEventListener('click', function () {
	if (map.hasLayer(openStreetMapLayer)) {
		map.removeLayer(openStreetMapLayer);
		arcgisSatelliteLayer.addTo(map);
	} else {
		map.removeLayer(arcgisSatelliteLayer);
		openStreetMapLayer.addTo(map);
	}
});
