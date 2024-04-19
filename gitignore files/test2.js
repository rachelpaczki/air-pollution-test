// Create Leaflet map
let map = L.map('map').setView([40, -100], 4);

// Add the OpenStreetMap tile layer as the base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load GeoJSON data for state boundaries
d3.json('../static/data/us-state-boundaries.geojson').then(stateBoundaryData => {
    // Create the GeoJSON layer using the loaded data
    var stateBoundaryLayer = L.geoJSON(stateBoundaryData, {
        style: {
            color: 'black',
            weight: 0.5,
            fill: false,
        }
    }).addTo(map);
});

// Create a layer control to toggle between disease layers
let layerControl = L.control.layers({}, null, { collapsed: false }).addTo(map);

// Nitrate Data
fetch('../data/json/acidrain.json')
    .then(response => response.json())
    .then(nitrateData => {
        let nitrateLayer = createMarkers(nitrateData, 'NO3');
        // Add nitrate  layer to the layer control
        layerControl.addOverlay(nitrateLayer, 'NO3');
    })
    .catch(error => {
        console.error('Error loading nitrate data:', error);
    });

// Function to calculate marker size based on data value
function calculateMarkerSize(value) {
    // Adjust the multiplier and power factor for a more dramatic effect
    return Math.pow(value/3.1, 2.5);
}

// Function to calculate marker color based on sum of pollutants using Chroma.js
function calculateMarkerColor(sum) {
    // Use a logarithmic scale and adjust the domain to match the range of sum values
    return chroma.scale(['#00ff00', '#ff0000']).domain([1, 20]).mode('lab')(sum).hex();
}

// Function to create markers for a specific pollutant layer
function createMarkers(data) {
    let markers = [];
    data.forEach(siteName => {
        // Create a marker for each city
        let marker = L.circleMarker([siteName.Latitude, siteName.Longitude], {
            radius: calculateMarkerSize(siteName.siteID),
            fillColor: calculateMarkerColor(siteName[`NO3`]), // Change to the desired pollutant for color
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add a popup with city information
        marker.bindPopup(`<b>${siteName.siteName}</b><br>${siteName.NO3}: ${siteName.siteID}`);

        // Add the marker to the markers array
        markers.push(marker);
    });

    // Create a layer group for the pollutant layer
    let pollutantLayer = L.layerGroup(markers);

    // Add the pollutant layer to the map
    pollutantLayer.addTo(map);

    // Return the pollutant layer
    return pollutantLayer;
}



// Sulfate Data
//fetch('../data/json/acidrain.json')
   // .then(response => response.json())
   // .then(sulfateData => {
   //     let sulfateLayer = createMarkers(sulfateData, 'SO4');
        // Add sulfate layer to the layer control
   //     layerControl.addOverlay(sulfateLayer, 'S04');
  //  })
   // .catch(error => {
  //      console.error('Error loading sulfate:', error);
 //   });

