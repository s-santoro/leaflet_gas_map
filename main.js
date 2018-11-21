// centre switzerland
// 46.798449, 8.231879

const accessToken = 'pk.eyJ1Ijoic3NhbnRvcm8iLCJhIjoiY2puazFrcDNzMGFjeTNwbWg2eTc2NG1vaCJ9.dcKsne2XPJhiv7sf2RLIsg';
let swissGeoJson = null;
let xml = null;
let data = null;

// fetch('data_fuel.xml')
//     // returns promise<String>
//     .then(response => response.text())
//     .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//     .then(data => xml = data);

let map = L.map('map').setView([46.798449, 8.231879], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: accessToken
}).addTo(map);

fetch('swiss_geoJson.json')
    .then(response => {
        return response.json()
    })
    .then(json => {
        swissGeoJson = json
    })
    .then(() => {
        L.geoJson(swissGeoJson, {
            style: function () {
                return {
                    fillColor: 'white',
                    weight: 3,
                    opacity: 0.6,
                    color: 'red', //Outline color
                    fillOpacity: 0
                }
            }
        }).addTo(map);
    });

let key = "_k";
let value = "_v";

fetch('data.json')
    // returns promise<String>
    .then(response => data = response.json())
    .then((json) => data = json)
    .then(() => {
        console.log(data.osm.node[450].tag);
        for (let x = 0; x < data.osm.node.length; x++) {
            let node = data.osm.node[x];
            let lat = node._lat;
            let lon = node._lon;
            for (let y = 0; y < node.tag.length; y++) {
                let tag = node.tag[y];
                let name = null;
                let brand = null;
                let street = null;
                let location = null;
            }
            L.marker([lat, lon]).addTo(map);
        }
    });

// let marker = L.marker([46.798449, 8.231879]).addTo(map);

// let popupMsg =
//     "<p>name: Bürgi</p>" +
//     "<p>city: Chur</p>" +
//     "<p>street: Alte Frauenfelderstrasse</p>" +
//     "<p>brand: Socar</p>";

// marker.bindPopup(popupMsg);