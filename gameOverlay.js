// Function to convert kilometers to latitude/longitude changes
function kilometersToLatLon(kilometers, latitude) {
    var latChange = kilometers / 111.0;
    var lonChange = kilometers / (111.0 * Math.cos(latitude * Math.PI / 180));
    return { latChange: latChange, lonChange: lonChange };
}

function addImageOverlay(game, map) {
    const { gameName, width, height, area } = game;

    const mapCenter = map.getCenter();
    const centerLat = mapCenter.lat;
    const centerLon = mapCenter.lng;

    const latLonWidth = kilometersToLatLon(width, centerLat);
    const latLonHeight = kilometersToLatLon(height, centerLat);

    const topLeftLat = centerLat - latLonHeight.latChange / 2;
    const topLeftLon = centerLon - latLonWidth.lonChange / 2;
    const bottomRightLat = centerLat + latLonHeight.latChange / 2;
    const bottomRightLon = centerLon + latLonWidth.lonChange / 2;

    const gameFileName = `${gameName}.png`;
    const baseUrl = window.location.origin + window.location.pathname;
    const imageUrl = baseUrl + 'Maps/' + gameFileName;
    
    let imageBounds = [[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]];
    const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
        opacity: 0.8,
        interactive: true
    }).addTo(map);

    // Convert area to square miles (1 km² ≈ 0.3861 mi²)
    const areaInSquareMiles = area * 0.3861;

    // Tooltip content with area in both km² and mi²
    const tooltipContent = `~ ${area.toLocaleString()} km²<br>~ ${areaInSquareMiles.toFixed(2).toLocaleString()} mi²`;

    // Bind tooltip to the image overlay
    imageOverlay.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        offset: [0, 0],
        sticky: true,
        className: 'custom-tooltip' // Optional: add custom CSS class for additional styling
    });

    // Make the ImageOverlay draggable
    let isDragging = false;
    let dragStartLatLng = null;

    // Mouse event listeners for dragging
    imageOverlay.getElement().addEventListener('mousedown', (e) => {
        const allOverlays = document.querySelectorAll('.leaflet-overlay-pane img');
        let maxZIndex = -1;
        allOverlays.forEach((overlay) => {
            const zIndex = parseInt(window.getComputedStyle(overlay).zIndex) || 0;
            maxZIndex = Math.max(maxZIndex, zIndex);
        });

        e.target.style.zIndex = maxZIndex + 1;

        isDragging = true;
        dragStartLatLng = map.mouseEventToLatLng(e);

        map.dragging.disable();
        e.preventDefault();
    });

    // Apply CSS border to the image element directly
    const imageElement = imageOverlay.getElement();
    imageElement.style.border = '2px solid rgba(0, 0, 0, 0)';

    imageOverlay.getElement().addEventListener('mouseover', () => {
        imageElement.style.border = '2px solid rgba(255, 0, 0, 0.5)';
    });

    imageOverlay.getElement().addEventListener('mouseout', () => {
        imageElement.style.border = '2px solid rgba(0, 0, 0, 0)';
    });

    map.on('mousemove', (e) => {
        if (!isDragging) return;

        let dragEndLatLng = map.mouseEventToLatLng(e.originalEvent);
        let latOffset = dragEndLatLng.lat - dragStartLatLng.lat;
        let lonOffset = dragEndLatLng.lng - dragStartLatLng.lng;

        let newBounds = [
            [
                imageBounds[0][0] + latOffset,
                imageBounds[0][1] + lonOffset,
            ],
            [
                imageBounds[1][0] + latOffset,
                imageBounds[1][1] + lonOffset,
            ]
        ];
        imageOverlay.setBounds(newBounds);

        dragStartLatLng = dragEndLatLng;
        imageBounds = newBounds;
    });

    map.on('mouseup', () => {
        isDragging = false;
        dragStartLatLng = null;
        map.dragging.enable();
    });

    // Zoom to the bounds of the new overlay
    map.fitBounds(imageBounds);

    // Remove the image overlay when right-clicked
    imageOverlay.getElement().addEventListener('contextmenu', function (event) {
        event.preventDefault();
        imageOverlay.remove();
    });
}

// Export the function so it can be used in the main script
export { addImageOverlay };