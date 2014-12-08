$(document).ready(function() {

// global for now

var width_dock_icon = 52;
var width_dock_corner = 25;
var width_sync = 66;

var total_dock = 0;

var height_window = $( window ).height();
var width_window = $( window ).width();


var nodeOnDraging = null;
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
var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

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

$(this).addClass('vis');
$(this).addClass('windows-vis');

//-----------------------------------------------------------------------------------
//	3.	Draggable Windows
//-----------------------------------------------------------------------------------

$('.content').remove();

var a = 3;
$('.content,.specific,.project,.share').draggable({ handle: '.title-inside', start: function(event, ui) { $(this).css("z-index", a++); }});
$(".window").draggable({
	handle: '.titleInside, .title-mac, .tab',
	refreshPositions: true,
	containment: 'window',
	start: function(event, ui) { $(this).css("z-index", a++); }
});


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
{name: "icon_1", imgName: "icon_1", screen: 0, i: 0, j: 0},
{name: "icon_2", imgName: "icon_2", screen: 0, i: 1, j: 0},
{name: "icon_3", imgName: "icon_3", screen: 0, i: 2, j: 0},
{name: "icon_4", imgName: "icon_4", screen: 0, i: 3, j: 0},
{name: "icon_5", imgName: "icon_5", screen: 0, i: 0, j: 1},
{name: "icon_6", imgName: "icon_6", screen: 0, i: 1, j: 1},
{name: "icon_7", imgName: "icon_7", screen: 0, i: 2, j: 1},
{name: "icon_8", imgName: "icon_8", screen: 0, i: 3, j: 1},
{name: "icon_9", imgName: "icon_9", screen: 0, i: 0, j: 2},
{name: "icon_11", imgName: "icon_11", screen: 0, i: 1, j: 2},
{name: "icon_12", imgName: "icon_12", screen: 0, i: 2, j: 2},
{name: "icon_13", imgName: "icon_13", screen: 0, i: 3, j: 2},
{name: "icon_14", imgName: "icon_14", screen: 0, i: 1, j: 3},
{name: "icon_15", imgName: "icon_15", screen: 0, i: 2, j: 3},
{name: "icon_16", imgName: "icon_16", screen: 0, i: 3, j: 3},
{name: "icon_10", imgName: "icon_10", screen: 0, i: 0, j: 3},
{name: "icon_13", imgName: "icon_13", screen: 0, i: 3, j: 4},
{name: "icon_14", imgName: "icon_14", screen: 0, i: 2, j: 4},
{name: "icon_15", imgName: "icon_15", screen: 0, i: 1, j: 4},
{name: "icon_16", imgName: "icon_16", screen: 0, i: 0, j: 4},


{name: "icon_21", imgName: "icon_1", screen: 1, i: 1, j: 0},
{name: "icon_22", imgName: "icon_2", screen: 1, i: 0, j: 0},
{name: "icon_23", imgName: "icon_3", screen: 1, i: 3, j: 0},
{name: "icon_24", imgName: "icon_4", screen: 1, i: 2, j: 0},
{name: "icon_25", imgName: "icon_5", screen: 1, i: 0, j: 1},
{name: "icon_27", imgName: "icon_7", screen: 1, i: 3, j: 1},
{name: "icon_28", imgName: "icon_8", screen: 1, i: 2, j: 1},
{name: "icon_29", imgName: "icon_9", screen: 1, i: 0, j: 2},
{name: "icon_211", imgName: "icon_11", screen: 1, i: 2, j: 2},
{name: "icon_212", imgName: "icon_12", screen: 1, i: 1, j: 2},
{name: "icon_213", imgName: "icon_13", screen: 1, i: 3, j: 2},
{name: "icon_214", imgName: "icon_14", screen: 1, i: 2, j: 3},
{name: "icon_215", imgName: "icon_15", screen: 1, i: 1, j: 3},
{name: "icon_216", imgName: "icon_16", screen: 1, i: 3, j: 3},

{name: "icon_31", imgName: "icon_1", screen: 2, i: 0, j: 1},
{name: "icon_32", imgName: "icon_2", screen: 2, i: 1, j: 1},
{name: "icon_33", imgName: "icon_3", screen: 2, i: 2, j: 1},
{name: "icon_34", imgName: "icon_4", screen: 2, i: 3, j: 1},
{name: "icon_35", imgName: "icon_5", screen: 2, i: 0, j: 0},
{name: "icon_36", imgName: "icon_6", screen: 2, i: 1, j: 0},
{name: "icon_38", imgName: "icon_8", screen: 2, i: 3, j: 0},
{name: "icon_39", imgName: "icon_9", screen: 2, i: 0, j: 2},
{name: "icon_311", imgName: "icon_11", screen: 2, i: 1, j: 2},
{name: "icon_312", imgName: "icon_12", screen: 2, i: 2, j: 2},
{name: "icon_313", imgName: "icon_13", screen: 2, i: 3, j: 2},
{name: "icon_317", imgName: "icon_17", screen: 2, i: 0, j: 3},

];

var height = parseInt($( window ).height() / 7);
var width = parseInt($( window ).width() / 16);
var offWidth = parseInt($( window ).width() * 0.013);
var offHeight = parseInt($( window ).height() * 0.05);
var iconWidth = width * 0.618;
var contentWidth = width * 0.9;
var contentHeight = height * 0.9;

var screenWidth = width * 4;

var dragging = false;

var gridster = $(".app-list ul").gridster({
	widget_base_dimensions: [80, 60],
	widget_margins: [15, 35],
	max_cols: 4,
	max_rows: 5,
	max_size_x: 1,
	max_size_y: 1,
	draggable: {
		start: function (event, ui) {
			ui.$helper.bind("click", function(event) { event.preventDefault(); });
			dragging = true;
		},
		stop: function (event, ui) {
			ui.$player.children('div.effect').addClass('ripple');
			setTimeout(function () {
				ui.$player.children('div.effect').removeClass('ripple');
				ui.$helper.unbind("click");
				dragging = false;
			}.bind(this), 900);
		}
	}
	}).data('gridster');

var addApp = function (app) {

	var node = $('<li id="'+app.name+'" draggable="true">'+
	'<div class="effect"></div>' +
	'<div class="app-img"><img src="res/img/'+ app.imgName + '.png" alt="Address Book" /></div>'+
	'<div class="app-name">'+ app.name + '</div>'+
	'</li>');

	var screenIdx = app.screen;
	var gap = screenIdx * (width + screenWidth);
	var x = app.i + 1;
	var y = app.j + 1;

	// node.offset({ top: height * y + offHeight, left: width * x + gap  });
	// node.width(contentWidth);
	// node.height(contentHeight);

	node.css('position', 'absolute');

	var img = node.find(".app-img img");
	img.width(iconWidth);
	img.height('auto');
	// node.attr('top', height * x + "px");
	// node.attr('left', width * y + "px");
	node.on('click', function () {
		if(dragging) {return ;}
		$(this).children('div.effect').addClass('ripple');
		setTimeout(function () {
			$(this).children('div.effect').removeClass('ripple');
			openWindow(this);
			addDock(this);
			showCorner();
			total_dock++;
			adjustHeader();
		}.bind(this), 900);
	});

	node.mousedown(function () {

		$(this).addClass('click');
	});

	node.mouseup(function () {
		$(this).removeClass('click');

	});

//	$('.app-list').append(node);
	gridster.add_widget(node, 1, 1, x, y);
}

addApp(appList[0]);
addApp(appList[1]);
addApp(appList[2]);
addApp(appList[3]);
addApp(appList[4]);
addApp(appList[5]);
addApp(appList[6]);
addApp(appList[7]);
addApp(appList[8]);
addApp(appList[9]);

var openWindow = function (node) {

	var html = $('<div id="finder" class="window finder ui-draggable windows-vis">' +
		'<nav class="control-window">' +
	    '<a href="#" class="deactivate">deactivate</a>' +
	    '<a href="#" class="minimize">minimize</a>' +
	    '<a href="#" class="close" data-rel="close">close</a>' +
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
    '<div>' +
      '<em><span>' + name + '</span></em>' +
        '<img src="'+ img + '" alt="Launchpad">' +
    '</div>' +
  '</li>');
	var img = dockIcon.find('img');
	img.reflect({margin_top: 8, height: 48, width: 48, length: 0.95, opacity: 0.3});

	$('div.dock ul').append(dockIcon);

}
var showCorner = function () {
$('.head .before').removeClass('empty');
$('.head .after').removeClass('empty');
}

var hideCorner = function () {
$('.head .before').addClass('empty');
$('.head .after').addClass('empty');
}

var adjustHeader = function () {
	var offset = total_dock ? total_dock * width_dock_icon + 2 * width_dock_corner : 0;
	var width = (width_window - offset - width_sync) /2 ;
	$(".head .left").width(width);
	$(".head .right").width(width);
}

adjustHeader();


});
