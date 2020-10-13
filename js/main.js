async function createMap() {
	var mbAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> |' + ' <a href="http://mapbox.com">Mapbox</a>';
	var apitoken = 'pk.eyJ1Ijoic3VnYXJhbG1vbmQiLCJhIjoiY2tiaDhsMXg1MDJ4bTMwb2RldXVxaHUwaSJ9.8dECxsXBCSd6x5vbmc8lqA'; //API Token - 'https://www.mapbox.com/install/'
	var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';
	var mbStyleUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={token}';

	var customBasemap = L.tileLayer(mbStyleUrl, {
		id: 'sugaralmond/ckbh8nfcb09wy1ipk1knkr9uu', //url to mapbox basemap
		token: apitoken,
		attribution: mbAttr,
	});
	/*
  var standardBasemap = L.tileLayer(mbUrl, {
    id: "mapbox.light",
    token: apitoken,
    attribution: mbAttr,
  });
  */
	const map = L.map('map', {
		center: [50.36, -106.5], //Map center coordinates
		zoom: 3, //initial zoom
		minZoom: 3,
		layers: [customBasemap], //basemap
	});

	const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson');
	const data = await res.json();

	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: '#ff7800',
		color: '#000',
		weight: 1,
		opacity: 0.5,
		fillOpacity: 0.5,
	};

	//https://leafletjs.com/reference-1.4.0.html#geojson-pointtolayer
	var pointToLayer = function (feature, latlng) {
		geojsonMarkerOptions.radius = feature.properties.mag * 5;
		geojsonMarkerOptions.fillColor = lerpColor('#00ffff', 'ff00ff', feature.properties.mag / 10);
		console.log(feature.properties);
		return L.circleMarker(latlng, geojsonMarkerOptions).bindTooltip(
			`<b style="font-size: 120%">${feature.properties.mag.toString()} </b>` + `<span style="font-size:80%"> ${feature.properties.place}</span>`
		);
	};

	//https://leafletjs.com/examples/geojson/
	let geojlayer = L.geoJSON(data.features, {
		pointToLayer: pointToLayer,
	}).addTo(map);
}

function lerpColor(a, b, amount) {
	var ah = parseInt(a.replace(/#/g, ''), 16),
		ar = ah >> 16,
		ag = (ah >> 8) & 0xff,
		ab = ah & 0xff,
		bh = parseInt(b.replace(/#/g, ''), 16),
		br = bh >> 16,
		bg = (bh >> 8) & 0xff,
		bb = bh & 0xff,
		rr = ar + amount * (br - ar),
		rg = ag + amount * (bg - ag),
		rb = ab + amount * (bb - ab);
	return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
} //lerpColor source: https://gist.github.com/rosszurowski/67f04465c424a9bc0dae

$(document).ready(createMap);
