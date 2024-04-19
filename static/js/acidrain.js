// Initialize Leaflet map
var myMap = L.map('map').setView([37.0902, -95.7129], 5); 

// Add base map layer (OpenStreetMap)
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load GeoJSON data for state boundaries
d3.json('../static/data/us-state-boundaries.geojson').then(stateBoundaryData => {
  // Create the GeoJSON layer using the loaded data
  var stateBoundaryLayer = L.geoJSON(stateBoundaryData, {
      style: {
          color: 'black',
          weight: 0.5,
          fill: false,
      }
  }).addTo(myMap);
});

// Load JSON data
fetch('../static/data/acidrain.json')
.then(response => response.json())
.then(data => {
  // Extract NO3 and SO4 values into an array
  var values = data.map(site => site.NO3 + site.SO4);

  // Define the color scale using Chroma.js
  var colorScale = chroma.scale(['blue', 'red']).domain([Math.min(...values), Math.max(...values)]);

  // Loop through each data point and add a CircleMarker to the map
  data.forEach(site => {
    // Calculate the sum of NO3 and SO4
    var sum = site.NO3 + site.SO4;

    // Get color based on the value
    var color = colorScale(sum).hex();

    // Create a CircleMarker at the specified latitude and longitude
    L.circleMarker([site.Latitude, site.Longitude], {
      radius: Math.sqrt(sum) * 4, 
      fillColor: color,
      color: 'white',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    })

    .bindPopup(`<b>${site.siteName}</b><br>NO3: ${site.NO3}<br>SO4: ${site.SO4}<br>Sum: ${sum}`)
    .addTo(myMap);
  });
})
.catch(error => {
  console.error('Error loading JSON data:', error);
});