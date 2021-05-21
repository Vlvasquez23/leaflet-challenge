console.log("Leaflet Step-1");

var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "©; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var graymap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    }
  );
 // Define a baseMaps object to hold our base layers
 var baseMaps = {
    "Satellite": satelliteMap,
    "Gray Map": graymap
  };

  // Create overlay object to hold our overlay layer
 // var overlayMaps = {
    //Earthquakes: earthquakes
 // };

var map = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 4
  });

  satelliteMap.addTo(map);
  // graymap.addTo(map);

//  L.control.layers(baseMaps, {
 //   collapsed: true
//}).addTo(map);

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
    
      // This function determines the color of the marker based on the magnitude of the earthquake.
      function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "d4ee00";
            default:
                return "#98ee00";
            }
      }    
    
      // This function determines the radius of the earthquake marker based on its magnitude.
      // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }
    
      // Here we add a GeoJSON layer to the map once the file is loaded.
      L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Magnitude: "
              + feature.properties.mag
              + "<br>Depth: "
              + feature.geometry.coordinates[2]
              + "<br>Location: "
              + feature.properties.place
          );
        }
      }).addTo(map);
    
      // Add legend
      var legend = L.control({
        position: "bottomright"
      });

      legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend");

          var levels = [-10, 10, 30, 50, 70, 90];
          var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
          ];

          
          for (var i = 0; i < levels.length; i++) {
              div.innerHTML +='<i style="background: ' + colors[i] + '"></i> ' +
                  levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
          }
          return div;
      };
    
      legend.addTo(map);

    });