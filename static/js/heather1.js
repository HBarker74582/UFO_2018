var heatMap = L.map("heat", {
    center: [39.0997222, -94.5783333],
    zoom: 5
});



L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(heatMap);

var heatMapPoints = d3.json('/alien_data').then(alien_data => {

    var heatArray = [];

    for (var i = 0; i < alien_data.length; i++) {
        var location = [alien_data[i].lat, alien_data[i].long];

        if (location) {
            heatArray.push([location[0], location[1]]);
        }
    }


    var heat = L.heatLayer(heatArray, {
        radius: 50,
        blur: 10
    }).addTo(heatMap);
    console.log("End");
});