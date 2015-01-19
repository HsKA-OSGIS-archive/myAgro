$(document).ready(function(){

$("#navigation li a").on("click", function(e){
	e.preventDefault();
	var hrefval = $(this).attr("href");
	if(hrefval == "#about") {
		var check = $("#navigation li a").hasClass("open");
		$('#about').css('z-index', 2);
		$('#login').css('z-index', 1);
		$('#dist').css('z-index', 1);
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
		var check = $("#navigation li a").hasClass("open");
		$('#login').css('z-index', 2);
		$('#about').css('z-index', 1);
		$('#dist').css('z-index', 1);
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
		var check = $("#navigation li a").hasClass("open");
		$('#dist').css('z-index', 2);
		$('#about').css('z-index', 1);
		$('#login').css('z-index', 1);
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
  
$("#closebtn").on("click", function(e){
	e.preventDefault();
	closeSidepage();
}); // end close button event handler

$("#closebtn2").on("click", function(e){
	e.preventDefault();
	closeSidepage();
}); // end close button event handler

$("#closebtn4").on("click", function(e){
	e.preventDefault();
	closeSidepage();
}); // end close button event handler

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

}); 

var passw = "123456";
 
function checkpass() {
	var password = document.getElementById("pass").value;
	if (password == passw) {
		alert("correct");
		window.location = "test.html";
		return false;
	}
	else {
		alert("Incorrect Password");
	}
}