window.onload = function() {

//initialize map
var map = L.map('base', {center: [12.0, -7.0], minZoom: 7, maxZoom: 14, zoom: 8});

//basemap definition
L.tileLayer( 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    subdomains: ['otile1','otile2','otile3','otile4']
}).addTo(map); //add to map


//create break points for farmer data - circle size
var break1 = [1000,2000,3000];
var break2 = [50,100,400];
var break3 = [5,15,25];
var breaks = break1; var legend = break1;

//define color of feature based on breaks
function getColor1(d) {
	return d == null ? 'rgba(0,0,0,0.2)':
			d < breaks[0]	? '#cbe7e1' :
			d < breaks[1]	? '#89bdb1' :
			d < breaks[2]	? '#4f877a' :
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

//no data features shaded grey
function style2(feature) {	
    return {
        fillColor: '#aaa',
        weight: 2,
        opacity: 1,
        color: '#aaa',
        fillOpacity: 0.5
    };
}

//initialize variables
var villagelist = []; var distancelist = [];
var distance; var end; var name; var start; var html;
var Lines = L.layerGroup();

//on each feature function - mouse events
//define popups, create charts, create distance matrix
function onEachFeature(feature, layer) {
	if (feature.properties.Village){
	
		//popups
		var popup = L.popup({closeButton: false, autoPan: false, className: 'popup'});
		popup.setContent(feature.properties.Village);
		layer.bindPopup(popup);
		layer.on('mouseover', function (e) {
			this.openPopup();
		});
		layer.on('mouseout', function (e) {
			this.closePopup();
		});

		//click events
		layer.on('click', function (e){
		
			//get rid of marker from add feature
			marker.setLatLng(L.latLng(10,45));
			//clear lines from distance
			Lines.clearLayers();
			//define new name for title
			name = e.target.feature.properties.Village;
			//farmers
			var farmers = e.target.feature.properties.farmers;
			
			if (charton == true){
				$( "#chartname" ).val( name ); //label chart
				
				$("#chart1").html(""); //clear old chart
				$("#chart2").html(""); //clear old chart
				
				$("#charttitle").css("display", "block"); //add chart title
				$("#pieleg").css("display", "block"); //add pie chart legend
				
				//create bar chart
				{var data = e.target.feature.properties.packets;
				var array = eval(data);
				var check = farmers/8;
				var max = Math.max.apply(Math,array);
				if (max < 1) {max = 1;}
				console.log(max);

				var formatCount = d3.format(",.0f");
				var margin = {top: 30, right: 30, bottom: 20, left: 30}, width = 250, height = 100;
				var x = d3.scale.linear().domain([0, max]).range([0, width]);

				var data = d3.layout.histogram().bins(x.ticks(10*max))(array);

				var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.y; })]).range([height, 0]);

				var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5*max);

				var svg = d3.select("#chart1").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var bar = svg.selectAll(".bar").data(data).enter().append("g").attr("class", "bar").attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("rect").attr("x", 1).attr("width", x(data[0].dx) - 1).attr("height", function(d) { return height - y(d.y); });
				
				bar.append("text").attr("dy", function(d){
					var place = formatCount(d.y);
						if (place == 0){
							return 50;
						}
						else if (place < check){
							return 0;
						}
						else{
							return 20;
						}
					}
					)
					.attr("y", -6).attr("x", x(data[0].dx) / 2)
					.attr("text-anchor", "middle").text(function(d) { return formatCount(d.y); });

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);} //end create bar chart
				
				//create pie chart
				var fpeanut = e.target.feature.properties.Fpeanut;
				var fcorn = e.target.feature.properties.Fcorn;
				var mpeanut = e.target.feature.properties.Mpeanut;
				var mcorn = e.target.feature.properties.Mcorn;
				
				var pie = new d3pie("#chart2", {
				  header: {
					title: {
					  text: "Farmers",
					  fontSize: 16
					},
					subtitle: {
						text: "Total: " + farmers,
						fontSize: 14
					},
					location: "pie-center"
				  },
				  size: {
					canvasWidth: 300,
					canvasHeight: 300,
					pieInnerRadius: "50%",
					pieOuterRadius: "100%"
				  },
				  data: {
					content: [
					  { label: "Peanut", value: mpeanut, color: "#848fb4" },
					  { label: "Corn", value: mcorn, color: "#bec585" },
					  { label: "Corn", value: fcorn, color: "#76830d" },
					  { label: "Peanut", value: fpeanut, color: "#445183" },
					]
				  },
				  labels: {
					outer: {
						hideWhenLessThanPercentage: 99,
					}
				  },
				  effects: {
					load: {
						speed: 200
					}
				  }
				});
			} //end create pie chart
			else if (diston == true){
				$( ".distance" ).empty();
				$( "#villagename" ).val( name );
				
				start = L.latLng(e.target.feature.geometry.coordinates[1],e.target.feature.geometry.coordinates[0]);
				villagelist = [];
				distancelist = [];
				
				for (i=0;i<(village[0].features.length);i++){
					end = L.latLng(village[0].features[i].geometry.coordinates[1],village[0].features[i].geometry.coordinates[0]);
					
					distance = start.distanceTo(end);
					if (distance < 10000){
						villagelist.push([village[0].features[i].properties.Village, Math.round(distance / 10)/100]);
						Lines.addLayer(L.polyline([start,end],{color:'#666', weight: 2, opacity: .5, dashArray:'5, 5', clickable: true}));
					}
					
				}
				
				Lines.addTo(map);
				
				villagelist.sort(function(a,b) {
					return a[1]-b[1]
				});
				
				villagelist.shift();
				
				html = '<table style="margin-top:80px;width:200px;color:#555;"><tr><td><b>Neighboring Villages</b></td></tr>';
				for (var i = 0; i < villagelist.length; i++) {
					html += '<tr>';
					html += '<td>' + villagelist[i][0] + '</td><td>' + villagelist[i][1] + ' km</td>';
					html += "</tr>";
				}
				html += '</table>';
				
				$( ".distance" ).append( html );
			}
		});
		
	}
	else if (feature.properties.NAME_4){
		layer.on('click', function (e){
			Lines.clearLayers();
			name = e.target.feature.properties.NAME_4;
			var farmers = e.target.feature.properties.farmers;
			$( "#chartname" ).val( name );
			
			$("#chart1").html("");
			$("#chart2").html("");
			
			$("#charttitle").css("display", "block");
			$("#pieleg").css("display", "block");
				
				//create bar chart
				{var data = e.target.feature.properties.packets;
				var array = eval(data);
				var max = Math.max.apply(Math,array);
				if (max < 1) {max = 1;}

				var formatCount = d3.format(",.0f");
				var check = farmers/5;
				var margin = {top: 30, right: 30, bottom: 20, left: 30}, width = 250, height = 100;

				var x = d3.scale.linear().domain([0, max]).range([0, width]);

				var data = d3.layout.histogram().bins(x.ticks(10*max))(array);

				var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.y; })]).range([height, 0]);

				var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);

				var svg = d3.select("#chart1").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var bar = svg.selectAll(".bar").data(data).enter().append("g").attr("class", "bar").attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("rect").attr("x", 1).attr("width", x(data[0].dx) - 1).attr("height", function(d) { return height - y(d.y); });

				bar.append("text").attr("dy", function(d){
					var place = formatCount(d.y);
						if (place == 0){
							return 50;
						}
						else if (place < check){
							return 0;
						}
						else{
							return 20;
						}
					}
					)
					.attr("y", -6).attr("x", x(data[0].dx) / 2).attr("text-anchor", "middle").text(function(d) { return formatCount(d.y); });

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);} //end create bar chart
				
				//create pie chart
				{
				var fpeanut = e.target.feature.properties.Fpeanut;
				var fcorn = e.target.feature.properties.Fcorn;
				var mpeanut = e.target.feature.properties.Mpeanut;
				var mcorn = e.target.feature.properties.Mcorn;
				
				var pie = new d3pie("#chart2", {
				  header: {
					title: {
					  text: "Farmers",
					  fontSize: 16
					},
					subtitle: {
						text: "Total: " + farmers,
						fontSize: 14
					},
					location: "pie-center"
				  },
				  size: {
					canvasWidth: 300,
					canvasHeight: 300,
					pieInnerRadius: "50%",
					pieOuterRadius: "100%"
				  },
				  data: {
					content: [
					  { label: "Peanut", value: mpeanut, color: "#848fb4" },
					  { label: "Corn", value: mcorn, color: "#bec585" },
					  { label: "Corn", value: fcorn, color: "#76830d" },
					  { label: "Peanut", value: fpeanut, color: "#445183" },
					]
				  },
				  labels: {
					outer: {
						hideWhenLessThanPercentage: 99,
					}
				  },
				  effects: {
					load: {
						speed: 200
					}
				  }
				});
			}//end create pie chart
		}); //end click event
	}
	else if (feature.properties.TYPE_2){
		layer.on('click', function (e){
			Lines.clearLayers();
			name = e.target.feature.properties.NAME_2;
			var farmers = e.target.feature.properties.farmers;
			$( "#chartname" ).val( name );
			$("#chart1").html("");
			$("#chart2").html("");
			
			$("#charttitle").css("display", "block");
			$("#pieleg").css("display", "block");
				
				//create bar chart
				{var data = e.target.feature.properties.packets;
				var array = eval(data);
				var check = farmers/8;
				var max = Math.max.apply(Math,array);
				if (max < 1) {max = 1;}
				
				var formatCount = d3.format(",.0f");
				var margin = {top: 30, right: 30, bottom: 20, left: 30}, width = 250, height = 100;

				var x = d3.scale.linear().domain([0, max]).range([0, width]);

				var data = d3.layout.histogram().bins(x.ticks(20))(array);

				var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.y; })]).range([height, 0]);

				var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);

				var svg = d3.select("#chart1").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var bar = svg.selectAll(".bar").data(data).enter().append("g").attr("class", "bar").attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("rect").attr("x", 1).attr("width", x(data[0].dx) - 1).attr("height", function(d) { return height - y(d.y); });

				bar.append("text").attr("dy", function(d){
					var place = formatCount(d.y);
						if (place == 0){
							return 50;
						}
						else if (place < 10){
							return 0
						}
						else if (place < 500){
							return -10;
						}
						else{
							return 30;
						}
					}
					)
					.attr("y", -6).attr("x", x(data[0].dx) / 2).attr("text-anchor", "middle").text(function(d) { return formatCount(d.y); });

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);} //end create bar chart
				
				//create pie chart
				{
				var fpeanut = e.target.feature.properties.Fpeanut;
				var fcorn = e.target.feature.properties.Fcorn;
				var mpeanut = e.target.feature.properties.Mpeanut;
				var mcorn = e.target.feature.properties.Mcorn;
				
				var pie = new d3pie("#chart2", {
				  header: {
					title: {
					  text: "Farmers",
					  fontSize: 16
					},
					subtitle: {
						text: "Total: " + farmers,
						fontSize: 14
					},
					location: "pie-center"
				  },
				  size: {
					canvasWidth: 300,
					canvasHeight: 300,
					pieInnerRadius: "50%",
					pieOuterRadius: "100%"
				  },
				  data: {
					content: [
					  { label: "Peanut", value: mpeanut, color: "#848fb4" },
					  { label: "Corn", value: mcorn, color: "#bec585" },
					  { label: "Corn", value: fcorn, color: "#76830d" },
					  { label: "Peanut", value: fpeanut, color: "#445183" },
					]
				  },
				  labels: {
					outer: {
						hideWhenLessThanPercentage: 99,
					}
				  },
				  effects: {
					load: {
						speed: 200
					}
				  }
				});
			}//end create pie chart
		}); //click event
	}
} //end on each feature

//initialize layers
var a = L.geoJson(level2);var b = L.geoJson(level4);var c = L.geoJson(village);

//layer handler for zoom change - add/remove layers
function layerHandler() {
	map.removeLayer(a);
	map.removeLayer(b);
	map.removeLayer(c);
	var currentZoom = map.getZoom();
	switch (currentZoom) {
		case 7:
		case 8:
			breaks = break1;
			legend = break1;
			a = L.geoJson(level2, {style: style1, onEachFeature: onEachFeature});
			map.addLayer(a, false);
		break;
		case 9: case 10:
			breaks = break2;
			legend = break2;
			b = L.geoJson(level4, {style: style1, onEachFeature:onEachFeature});
			map.addLayer(b, false);
		break;
		default:
			breaks = break3
			legend = break3;
			c = L.geoJson(village, {pointToLayer: function (feature, latlng) {
				return L.circle(latlng, (feature.properties.Extent * 1000), style1(feature));
			}, onEachFeature:onEachFeature});
			map.addLayer(c, false);
		break;
	}
	$("#leg1").val("Less than " + legend[0]);
	$("#leg2").val((legend[0] + 1) + " - " + legend[1]);
	$("#leg3").val((legend[1] + 1) + " - " + legend[2]);
	$("#leg4").val("More than " + (legend[2] + 1));
}

//calls layer handler on zoom
map.on('zoomend', function (e) {
	layerHandler();
});


//create marker for add feature
var marker = L.marker([10,45], {draggable: true}).addTo(map);
marker.on('drag', dragPoint);
var point; var added = [];

//add feature click event
map.on('click', function(e){
	if (addpointon == true){
		//clear lines from distance
		Lines.clearLayers();
		point = e.latlng;
		marker.setLatLng(point);
		$( "#lat" ).val( Math.round(point.lat * 1000000)/1000000 );
		$( "#lng" ).val( Math.round(point.lng * 1000000)/1000000 );
	}
});

//drag point and update coordinates
function dragPoint(e){
	point = marker.getLatLng();
	$( "#lat" ).val( Math.round(point.lat * 1000000)/1000000 );
	$( "#lng" ).val( Math.round(point.lng * 1000000)/1000000 );
}

//locate user
document.getElementById("locate").onclick = getLocation;
function getLocation(){
	map.locate({setView: true});
	
	map.on('locationfound', function(e){
		point = e.latlng;
		marker.setLatLng(point);
		$( "#lat" ).val( Math.round(point.lat * 1000000)/1000000 );
		$( "#lng" ).val( Math.round(point.lng * 1000000)/1000000 );
	})
	
	map.on('locationerror', function(e){
		alert(e.message);
	})
}

layerHandler();
}