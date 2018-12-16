const accessToken =
  "pk.eyJ1Ijoic3NhbnRvcm8iLCJhIjoiY2puazFrcDNzMGFjeTNwbWg2eTc2NG1vaCJ9.dcKsne2XPJhiv7sf2RLIsg";
let swissGeoJson = null;
let data = null;
let brands = document.querySelector("#filter").options;
let markerCluster = L.markerClusterGroup();
let fuelstations = [];
let map = L.map("map").setView([46.798449, 8.231879], 8);

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: accessToken
  }
).addTo(map);

fetch("swiss_geoJson.json")
  .then(response => {
    return response.json();
  })
  .then(json => {
    swissGeoJson = json;
  })
  .then(() => {
    L.geoJson(swissGeoJson, {
      style: function() {
        return {
          fillColor: "white",
          weight: 3,
          opacity: 0.6,
          color: "red", //Outline color
          fillOpacity: 0
        };
      }
    }).addTo(map);
  })
  .catch(error => console.log(error));

fetch("data_fuel.json")
  .then(response => (data = response.json()))
  .then(json => (data = json))
  .then(() => {
    for (let x = 0; x < data.elements.length; x++) {
      let node = data.elements[x];
      let lat = node.lat;
      let lon = node.lon;
      let popupMsg = "";
      let name =
        node.tags.name != undefined ? node.tags.name.toLowerCase() : null;
      let brand =
        node.tags.brand != undefined ? node.tags.brand.toLowerCase() : null;
      let operator =
        node.tags.operator != undefined
          ? node.tags.operator.toLowerCase()
          : null;

      Object.keys(node.tags).forEach(function(key) {
        popupMsg = popupMsg + getPopUpEntry(key, node.tags[key]);
      });

      for (i = 0; i < brands.length; i++) {
        if (
          brands[i].value === name ||
          brands[i].value === brand ||
          brands[i].value === operator
        ) {
          let fuelstation = {
            name: name,
            brand: brand,
            operator: operator,
            lat: lat,
            lon: lon,
            popupMsg: popupMsg
          };
          fuelstations.push(fuelstation);
          let marker = L.marker([lat, lon]);
          marker.bindPopup(popupMsg);
          markerCluster.addLayer(marker);
        }
      }
    }
    map.addLayer(markerCluster);
    document.querySelector("#filter-amount").innerText = fuelstations.length;
  })
  .catch(error => console.log(error));

// Event-listener for select-object
document.querySelector("#filter").addEventListener("change", filterByBrand);

// Remove all markers and add only filtered markers
function filterByBrand() {
  let brand = this.value;
  let filteredFuelstations = fuelstations.filter(item => {
    return (
      item.name === brand ||
      item.brand === brand ||
      item.operator === brand ||
      "all" === brand
    );
  });
  let filteredMarkers = [];
  filteredFuelstations.forEach(item => {
    let marker = L.marker([item.lat, item.lon]);
    marker.bindPopup(item.popupMsg);
    filteredMarkers.push(marker);
  });
  markerCluster.clearLayers();
  markerCluster.addLayers(filteredMarkers);
  document.querySelector("#filter-amount").innerText =
    filteredFuelstations.length;
}

function getPopUpEntry(key, value) {
  if (key === "amenity") {
    return "";
  }
  return "<p>" + key.toLowerCase() + ": " + value.toLowerCase() + "</p>";
}
