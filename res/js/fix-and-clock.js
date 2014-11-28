$(document).ready(function() {

// global for now
var sel_dock = "div.dock";

var width_dock_icon = 48;
var width_dock_corner = 25;

var total_dock = 0;

var height_window = $( window ).height();
var width_window = $( window ).width();

//-----------------------------------------------------------------------------------
//	0.	Modernizr test
//-----------------------------------------------------------------------------------
if (Modernizr.cssanimations) {
	$('#fail').remove();
}
else {
	$('#fail').addClass('visible');
}

//-----------------------------------------------------------------------------------
//	1.	Clock
//-----------------------------------------------------------------------------------

var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

var newDate = new Date();
newDate.setDate(newDate.getDate());
$('#DateAbbr').html(dayNames[newDate.getDay()].substr(0,3) + " ");

setInterval( function() {
	var minutes = new Date().getMinutes();
	$(".min, .mins").html(( minutes < 10 ? "0" : "" ) + minutes);
    },1000);

setInterval( function() {
	var hours = new Date().getHours();
	$(".hours, .hour").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);

//-----------------------------------------------------------------------------------
//	2.	Fix Classes after Validate Login
//-----------------------------------------------------------------------------------

// $('.submit').click(function() {
// 	var ValPassword = $('#password').val() === 'admin';
//     if (ValPassword === true) {
		// $('input[type=password]').addClass('valid');
		// $('.tooltip-pass').hide();
		// $('.submit').removeClass('submit').addClass('charge');
		// $('#pageLogin').addClass('initLog').delay(190).queue(function() { $(this).removeClass('initLog').addClass('initLogExit'); $(this).dequeue(); });;
		// $('#page, #head').delay(250).queue(function() { $(this).addClass('vis'); $(this).dequeue(); });
		// $('.window').delay(300).queue(function() { $(this).addClass('windows-vis'); $(this).dequeue(); });
    // }
//     else {
// 		$('.tooltip-pass').hide();
// 		$('input[type=password]').select();
//     	$('.validate').addClass('error').delay(21).queue(function() { $(this).removeClass('error'); $(this).dequeue(); $('.tooltip-pass').show(); });
// 			return false;
//     	}
// });

$(this).addClass('vis');
$(this).addClass('windows-vis');

//-----------------------------------------------------------------------------------
//	3.	Draggable Windows
//-----------------------------------------------------------------------------------

$('.content').remove();

var a = 3;
$('.content,.specific,.project,.share').draggable({ handle: '.title-inside', start: function(event, ui) { $(this).css("z-index", a++); }});
$(".window").draggable({ handle: '.titleInside, .title-mac, .tab', refreshPositions: true, containment: 'window', start: function(event, ui) { $(this).css("z-index", a++); } });


//-----------------------------------------------------------------------------------
//	4.	Dock
//-----------------------------------------------------------------------------------

$('.dock ul li').hover(
	function(){
		$(this).addClass('ok').prev().addClass('prev').prev().addClass('prev-ancor');
		$(this).addClass('ok').next().addClass('next').next().addClass('next-ancor');
	},
	function(){
		$('.dock ul li').removeClass('ok prev next next-ancor prev-ancor');
	}
);

//-----------------------------------------------------------------------------------
//	5.	Hide and Close
//-----------------------------------------------------------------------------------
var left = 50 + '%';
var top = 15 + '%';
var item = $('<div class="fresh"></div>').hide();
var itemR = $('<div class="fresh"></div>').hide();

$("a[data-rel=close]").click(function(e) {
    e.preventDefault();
    $(this.hash).fadeOut(200, function() {
		$(this).css({ top: top, left: left });
	});
});

$("a[data-rel=show]").click(function(e) {
    e.preventDefault();
    $(this.hash).show();
});

$(".dock li a[data-rel=showOp]").click(function(e) {
    e.preventDefault();
	$(this).addClass('bounce').delay(1600).queue(function() { $(this).removeClass('bounce'); $(this).append(item); item.fadeIn(500); $(this).dequeue(); });
    $("#warning").delay(1630).queue(function() { $(this).show(); $(this).dequeue(); });
});

$("#warning a[data-rel=close]").click(function(e) {
    e.preventDefault();
	item.fadeOut(500);
    $(this.hash).hide();
});

$(".dock li a[data-rel=showOpTrash]").click(function(e) {
    e.preventDefault();
	$(this).addClass('bounce').delay(1600).queue(function() { $(this).removeClass('bounce'); $(this).append(itemR); itemR.fadeIn(500); $(this).dequeue(); });
    $("#trash").delay(1630).queue(function() { $(this).show(); $(this).dequeue(); });
});

$("#trash a[data-rel=close]").click(function(e) {
    e.preventDefault();
	itemR.fadeOut(500);
    $(this.hash).hide();
});


var appList =  [
				{name: "App Store", imgName: "appstore"},
				{name: "iChat", imgName: "ichat"},
				{name: "skype", imgName: "skype"},
				{name: "iChat", imgName: "ichat"},
				{name: "addressBook", imgName: "address"}];

var height = parseInt($( window ).height() / 7);
var width = parseInt($( window ).width() / 16);
var offWidth = parseInt($( window ).width() * 0.013);
var offHeight = parseInt($( window ).height() * 0.05);
var iconWidth = width * 0.618;
var contentWidth = width * 0.9;

for (j = 0; j < 12; j++) {

	var rowIndex = Math.floor(j / 4);

	for (i in appList) {

		var app = appList[i];
		var node = $('<li id="addressBook">'+
			'<img src="res/img/'+ app.imgName + '.png" alt="Address Book" />'+
			'<div class="app-name">'+ app.name + '</div>'+
			'</li>');
		var x = parseInt(i) + 1;

		var y = j + 1 + rowIndex;

		node.offset({ top: height * x + offHeight, left: width * y });
		node.height('auto');
		node.width(contentWidth);
		node.css('position', 'absolute');

		var img = node.children("img");
		img.width(iconWidth);
		img.height('auto');
//		node.attr('top', height * (i + 1) + "px");
//		node.attr('left', width * (j + 1) + "px");
console.log(node);
		node.on('click', function () {
			console.log('click');
			openWindow(this);
			addDock(this);
			showCorner();
			total_dock++;
			adjustHeader();
		});

		$('.app-list').append(node);

	}
}

var openWindow = function (node) {

	var html = $('<div id="finder" class="window finder ui-draggable windows-vis">' +
		'<nav class="control-window">' +
	    '<a href="#" class="deactivate">deactivate</a>' +
	    '<a href="#" class="minimize">minimize</a>' +
	    '<a href="#finder" class="close" data-rel="close">close</a>' +
	  '</nav>' +
    '<h1 class="titleInside">About Finder</h1>' +
    '<div class="container">' +
    	'<div class="container-inside">' +
			'</div>'+
    '</div>' +
	'</div>');
	html.find("a.close").on('click', function() {
		html.remove();
	});
	$('.app-list').append(html);
}

var addDock = function (node) {
	var ele =  $(node);
	var img = ele.find("img").attr('src');
	var name = ele.find("div.app-name").html();
	var dockIcon = $('<li class="dock_icon">' +
  	'<a href="#warning" data-rel="showOp">' +
      	'<em><span>' + name + '</span></em>' +
          '<img src="'+ img + '" alt="Launchpad">' +
      '</a>' +
  '</li>');
	$('div.dock ul').append(dockIcon);
}
var showCorner = function () {
	$(sel_dock).removeClass('empty');
}

var hideCorner = function () {
	$(sel_dock).addClass('empty');
}

var adjustHeader = function () {
	var offset = total_dock ? total_dock * width_dock_icon - 2 * width_dock_corner : 0;
	var width = (width_window - offset) /2 ;
	$(".head").width(width);
}

adjustHeader();

});
