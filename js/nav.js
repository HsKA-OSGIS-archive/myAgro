$(document).ready(function(){

var hrefval;

//define which side page to 'open'
$("#navigation li a").on("click", function(e){
	e.preventDefault();
	hrefval = $(this).attr("href");
	if(hrefval == "#about") {
		addpointon = false;
		diston = false;
		charton = true;
		var check = $("#navigation li a").hasClass("open");
		$('#about').css('z-index', 2);
		$('#login').css('z-index', 1);
		$('#dist').css('z-index', 1);
		$('#add').css('z-index', 1);
		var distance = $('#mainpage').css('left');
		if(distance == "auto" || distance == "0px") {
			$(this).addClass("open");
			openSidepage();
		}
		else if (check == true){
			$("#navigation li a").removeClass("open");
			$(this).addClass("open");
		}
		else {
			closeSidepage();
		}
	}
	else if (hrefval == "#login"){
		addpointon = false;
		diston = false;
		charton = false;
		var check = $("#navigation li a").hasClass("open");
		$('#login').css('z-index', 2);
		$('#about').css('z-index', 1);
		$('#dist').css('z-index', 1);
		$('#add').css('z-index', 1);
		var distance = $('#mainpage').css('left');
		if(distance == "auto" || distance == "0px") {
			$(this).addClass("open");
			openSidepage();
		}
		else if (check == true){
			$("#navigation li a").removeClass("open");
			$(this).addClass("open");
		}
		else {
			closeSidepage();
		}
	}
	else if (hrefval == "#dist"){
		addpointon = false;
		diston = true;
		charton = false;
		var check = $("#navigation li a").hasClass("open");
		$('#dist').css('z-index', 2);
		$('#about').css('z-index', 1);
		$('#login').css('z-index', 1);
		$('#add').css('z-index', 1);
		var distance = $('#mainpage').css('left');
		if(distance == "auto" || distance == "0px") {
			$(this).addClass("open");
			openSidepage();
		}
		else if (check == true){
			$("#navigation li a").removeClass("open");
			$(this).addClass("open");
		}
		else {
			closeSidepage();
		}
	}
	else if (hrefval == "#add"){
		addpointon = true;
		diston = false;
		charton = false;
		var check = $("#navigation li a").hasClass("open");
		$('#dist').css('z-index', 1);
		$('#about').css('z-index', 1);
		$('#login').css('z-index', 1);
		$('#add').css('z-index', 2);
		var distance = $('#mainpage').css('left');
		if(distance == "auto" || distance == "0px") {
			$(this).addClass("open");
			openSidepage();
		}
		else if (check == true){
			$("#navigation li a").removeClass("open");
			$(this).addClass("open");
		}
		else {
			closeSidepage();
		}
	}
}); // end click event handler

//close buttons
$("#closebtn").on("click", function(e){
	e.preventDefault();
	closeSidepage();
});

$("#closebtn2").on("click", function(e){
	e.preventDefault();
	closeSidepage();
});

$("#closebtn3").on("click", function(e){
	e.preventDefault();
	closeSidepage();
});

$("#closebtn4").on("click", function(e){
	e.preventDefault();
	closeSidepage();
});
// end close buttons

function openSidepage() {
	$('#mainpage').animate({
		left: '350px'
	}, 400, 'easeOutBack');
}
  
function closeSidepage(){
	$("#navigation li a").removeClass("open");
	$('#mainpage').animate({
		left: '0px'
	}, 400, 'easeOutQuint');
}


//login
document.getElementById("loginbutton").onclick = checkpass;
var passw = "1234";
 
function checkpass() {
	var password = document.getElementById("pass").value;
	if (password == passw) {
		$("#navigation li a").removeClass("disabled");
		$("#navigation li a").removeClass("open");
		closeSidepage();
	}
	else {
		alert("Incorrect Password");
	}
}

//add feature
$( "#addfeature" ).submit(function( event ) {
	event.preventDefault();	

	// Get some values from elements on the page:
	var $form = $( this ),
		agent = $form.find( "#agent" ).val(),
		lat = $form.find( "#lat" ).val(),
		lng = $form.find( "#lng" ).val(),
		farmer = $form.find( "#farmer" ).val(),
		crop = $form.find( "#croptype" ).val(),
		field = $form.find( "#fieldsize" ).val();

	// Send the data using post
	var posting = $.post( "./php/createfile.php", { agent: agent, lat: lat, lng: lng, farmer: farmer, crop: crop, field: field } );
 
	// Put the results in a div
	posting.done(function( output ) {
		$( "#finish" ).append( farmer + " added." );
		newobj = output;
	});
});

});
