// Assign url of json data to a variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query url
d3.json(queryUrl, function(data) { 
    // When we get back the data, we pass data.features (array from Geojson data) 
    // into the createFeatures function
    createFeatures(data.features);
  });

// Define a function we want to run once for each feature in the features array
function createFeatures(earthquakeData) {

    // Give each feature a popup describing the place and time of the earthquake  
    function bindFeaturePopUp(feature, layer) {
      // on that layer we want to bind a popup
      layer.bindPopup("<h3>" + feature.properties.place + "</h3>" +
        "<h4>" + "Magnitude: " + feature.properties.mag +
        "</h4><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// Create a GeoJSON layer containing the features array on the earthquakeData object
  // Because earthquakeData is a geojson doc rather than try and parse the 
  // data ourselves, there is a geojson function in Leaflet (L.geoJSON) - 
  // it will read that geoJSON and make some markers automatically
  var earthquakes = L.geoJSON(earthquakeData, { // passing in array of features we want to visualise from geojson data
    // Run the onEachFeature function once for every feature in the array in the Geojson data
    // onEachFeature we can create some custom behaviour e.g. on the 
    // layer bind the popup and then substitute in the various feature properties we want to show   
    onEachFeature: bindFeaturePopUp // for every feature in my Geojson data (thats rep by the earthquakeData), 
                                    // run the bindFeature function
  });

  // Then passing our earthquakes Geojson layer to the createMap function
  createMap(earthquakes); 
}

function createMap(earthquakes) {

  // Define a lightmap layer and streetmap layer (base layers - only have
  // one active at a time)
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Define a baseMaps object (dictionary) to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Street Map": streetmap // key will display on screen, binds back to the street map tile layer
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes // earthquakes was created earlier and is a Geojson layer with
                              // all our points on it
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", { // passing in the id of html element where we want the map to be rendered
    center: [
      40.07, -94.5
    ],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, { // L.control - Leaflet gives us a handy way of creating controls on our map
    collapsed: false
  }).addTo(myMap);
}

