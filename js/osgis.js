window.onload = function() {

//initialize map
var map = L.map('base', {center: [12.0, -7.0], minZoom: 7, maxZoom: 14, zoom: 8});

//basemap definition
L.tileLayer( 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    subdomains: ['otile1','otile2','otile3','otile4']
}).addTo(map); //add to map

function getColor1(d) {
	return d == null ? 'rgba(0,0,0,0.2)':
			d < 5	? '#cbe7e1' :
			d < 15	? '#89bdb1' :
			d < 25	? '#4f877a' :
							'#265c4f' ;
}

//define style of cloropleth
function style1(feature) {	
    return {
        fillColor: getColor1(feature.properties.farmers),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.8
    };
}

function style2(feature) {	
    return {
        fillColor: '#aaa',
        weight: 2,
        opacity: 1,
        color: '#aaa',
        fillOpacity: 0.5
    };
}

var z = L.latLng(12,-7);
var y = L.latLng(10,-8);
var villagelist = [];
var distancelist = [];
var distance; var end; var name; var start; var html;
var Lines = L.layerGroup();

function onEachFeature(feature, layer) {
	if (feature.properties.Village){
	
/* 		var popup = L.popup({closeButton: false, autoPan: false, className: 'popup'});
		popup.setContent(feature.properties.Village);
		layer.bindPopup(popup);
		layer.on('click', function (e) {
			this.openPopup();
		});
		layer.on('mouseout', function (e) {
			this.closePopup();
		}); */
		layer.on('click', function (e){
			$( ".distance" ).empty();
			
			name = e.target.feature.properties.Village;
			$( "#villagename" ).val( name );
			start = L.latLng(e.target.feature.geometry.coordinates[1],e.target.feature.geometry.coordinates[0]);
			villagelist = [];
			distancelist = [];
			Lines.clearLayers();
			
			for (i=0;i<(village[0].features.length);i++){
				end = L.latLng(village[0].features[i].geometry.coordinates[1],village[0].features[i].geometry.coordinates[0]);
				
				distance = start.distanceTo(end);
				if (distance < 10000){
					villagelist.push([village[0].features[i].properties.Village, Math.round(distance / 10)/100]);
					Lines.addLayer(L.polyline([start,end],{color:'#666', weight: 2, opacity: .5, dashArray:'5, 5', clickable: true}));
				}
				
			}
			
			Lines.addTo(map);
			console.log(Lines);
			
			villagelist.sort(function(a,b) {
				return a[1]-b[1]
			});
			
			villagelist.shift();
			
 			html = '<table style="width: 200px; color: #666;"><tr><td><b>Neighboring Villages</b></td></tr>';
			for (var i = 0; i < villagelist.length; i++) {
				html += '<tr>';
				html += '<td>' + villagelist[i][0] + '</td><td>' + villagelist[i][1] + ' km</td>';
				html += "</tr>";
			}
			html += '</table>';
			
			$( ".distance" ).append( html );
		});
	}
	else if (feature.properties.NAME_4){
		layer.on('click', function (e){
			name = e.target.feature.properties.NAME_4;
			$( "#villagename" ).val( name );
		});
	}
	else{
		layer.on('click', function (e){
			name = e.target.feature.properties.NAME_2;
			$( "#villagename" ).val( name );
		});
	}
}
	


//initialize layers
var a = L.geoJson(level2, {style: style1, onEachFeature: onEachFeature}).addTo(map);
var b = L.geoJson(level4, {style: style1, onEachFeature:onEachFeature});
var c = L.geoJson(village, {pointToLayer: function (feature, latlng) {
				return L.circle(latlng, (feature.properties.Extent * 1000), style1(feature));
			}, onEachFeature:onEachFeature});

//layer handler for zoom change, variable change
function layerHandler() {
	map.removeLayer(a);
	map.removeLayer(b);
	map.removeLayer(c);
	var currentZoom = map.getZoom();
	switch (currentZoom) {
		case 7:
		case 8:
			map.addLayer(a, false);
		break;
		case 9: case 10:
			map.addLayer(b, false);
		break;
		default:
			map.addLayer(c, false);
		break;
	}
}

//calls layer handler on zoom
map.on('zoomend', function (e) {
	layerHandler();
});
}