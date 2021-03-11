// Create map
var myMap = L.map('map').setView([40, -94], 4);

// Add base layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);


// Assign url of json data to a variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query url
d3.json(queryUrl, function(data) { 

    // Create markers layer with color dependent on magnitude
    markersLayer = L.geoJson(data, {
      style: function(feature) {
        var mag = feature.properties.mag;
        if (mag >= 5.0) {
          return { 
            color: "#800026"
          };
        }
        else if (mag >= 4.0) {
          return {
            color: "#BD0026"
          };
        }
        else if (mag >= 3.0) {
          return {
            color: "#FC4E2A"
          };
        }
        else if (mag >= 2.0) {
          return {
            color: "#FD8D3C"
          };
        }
        else if (mag >= 1.0) {
          return {
            color: "#FED976"
          };
        }
        else { 
          return {
            color: "#FFEDA0"
        }; 
      }
    },

    // Use OnEachFeature to get data for pop-up box
    onEachFeature: function(feature, layer) {

      var popupText = "<h3>" + feature.properties.place + "</h3>" +
      "<h4>" + "Magnitude: " + feature.properties.mag +
      "</h4><hr><p>" + new Date(feature.properties.time) + "</p>";

        layer.bindPopup(popupText, {
          closeButton: true,
          offset: L.point(0, -20)
        });
        layer.on('click', function() {
          layer.openPopup();
        });
    },

    // Create circle markers for earthquakes with circle radius dependent on magnitude
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.round(feature.properties.mag) * 3,
      });
    },
  }).addTo(myMap);


// Create a legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];
        colors = ["#FFEDA0", "#FED976", "#FD8D3C", "#FC4E2A", "#BD0026", "#800026"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? " < " + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to map
  legend.addTo(myMap);

});






