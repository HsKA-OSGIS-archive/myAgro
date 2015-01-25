$(document).ready(function(){
function piechart(){
var pie = new d3pie("#chart2", {
  header: {
    title: {
      text: "Farmers"
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
      { label: "Peanut", value: 1, color: "#848fb4" },
      { label: "Corn", value: 2, color: "#bec585" },
      { label: "Corn", value: 3, color: "#76830d" },
      { label: "Peanut", value: 2, color: "#445183" },
    ]
  },
  labels: {
	outer: {
		hideWhenLessThanPercentage: 50,
	}
  }
});
}
});