///// Via Leaflet
// Initialize Leaflet map
var map = L.map('map').setView([37.0902, 95.7129], 5); 

// Add base map layer (OpenStreetMap)
let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Collect data for each later (nitrate, sulfate, both)
fetch('static/data/acidrain.json')
    .then(response => response.json())
    .then(nitrateData => {
        let nitrateLayer = createMarkers(nitrateData, 'NO3');
        // Add cancer layer to the layer control
        layerControl.addOverlay(nitrateLayer, 'NO3');
    })
    .catch(error => {
        console.error('Error loading pollutant data:', error);
    });

fetch('static/data/acidrain.json')
    .then(response => response.json())
    .then(sulfateData => {
        let sulfateLayer = createMarkers(sulfateData, 'SO4');
        // Add cancer layer to the layer control
        layerControl.addOverlay(sulfateLayer, 'SO4');
    })
    .catch(error => {
        console.error('Error loading pollutant data:', error);
    });


// Function to create markers for a specific pollutant layer
function createMarkers(data) {
    let markers = [];
    data.forEach(siteName => {
        // Create a marker for each siteID
        let marker = L.circleMarker([siteName.Latitude, siteName.Longitude], {
            fillColor: calculateMarkerColor(siteName[`NO3`]), 
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add the marker to the markers array
        markers.push(marker);
    });

    // Create a layer group for pollutant layers
    let nitrateLayer = L.layerGroup(markers);

    // Add the layers to the map
    nitrateLayer.addTo(map);

    // Return the nitrate layer
    return nitrateLayer;
    
}
// Function to create markers for a specific pollutant layer
function createMarkers(data) {
    let markers = [];
    data.forEach(siteName => {
        // Create a marker for each siteID
        let marker = L.circleMarker([siteName.Latitude, siteName.Longitude], {
            fillColor: calculateMarkerColor(siteName[`SO4`]), 
            color: '#222',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add the marker to the markers array
        markers.push(marker);
    });

    // Create a layer group for pollutant layer
    let sulfateLayer = L.layerGroup(markers);

    // Add the layers to the map
    sulfateLayer.addTo(map);

    //return the sulfate layer
    return sulfateLayer;
    
}
