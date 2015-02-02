import Ember from 'ember';
import keyUtils from '../utils/keys';

var KEYS = keyUtils.KEYS;
var get = Ember.get;

export default Ember.View.extend({
  templateName: 'applist',
  classNames: ['applist'],

  height: 600,
  width: 400,

  left: 89,
  top: 103,

  init: function () {
    this._super();
    this.handleSize();
    Ember.$(window).resize(function() {
      this.handleSize();
    }.bind(this));
  },

  didInsertElement: function () {
    this.handleSize();
  },

  handleSize: function () {

    var minWidthIcon = 48;
    var minHeightWin = 600;
    var minWidthWin = 800;
    var winWidth  = Math.max(Ember.$(window).width(), minWidthWin);
    var winHeight = Math.max(Ember.$(window).height()*0.85, minHeightWin);

    var height = (winHeight) * 0.9;
    var width = winWidth / 3 * 0.86 ;
    var widthOffset = (winWidth - 3 * (width)) / 4;

    var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
    var iconHeight = iconWidth * 4 / 3;

    var offsetWidth  = (width - iconWidth * 4) / 5;
    var offsetHeight = (height - iconHeight * 5) / 6;

    this.setProperties({
      screenWidth:  width,
      screenHeight: height,
      screenTop:    0,
      widthOffset:  widthOffset,
      iconWidth:    iconWidth,
      iconHeight:   iconHeight,
      offsetHeight: offsetHeight,
      offsetWidth:  offsetWidth
    });
  },

  getScreenRowCol: function (left, top) {
    var offsetWidth = this.get('offsetWidth');
    var offsetHeight = this.get('offsetHeight');
    var screenWidth = this.get('screenWidth');
    var widthOffset = this.get('widthOffset');
    var screenLeft = screenWidth + widthOffset + 10;

    var newScr = 0;
    for (var i = 0 ; i < 3; i++) {
      if (left >= screenLeft * i + widthOffset && left < screenLeft * (i + 1) + widthOffset) {
        newScr = i;
      }
    }

    var newCol = Math.round((left - offsetWidth/2 - newScr * screenLeft - widthOffset) * 4 / screenWidth);
    var newRow = Math.round((top - offsetHeight/2) * 5 / this.get('screenHeight'));

    newCol = newCol < 0 ? 0: newCol;
    newCol = newCol > 3 ? 3: newCol;
    return {row: newRow, col: newCol, scr: newScr};
  },

  onMouseDown: function (app, offsetX, offsetY) { // this will be called by item
    this.setProperties({
      'activeApp': app,
      'offsetX': offsetX,
      'offsetY': offsetY
    });

    this.$(document).on('mousemove', this.onMouseMove.bind(this));
    this.on('mouseUp', this.onMouseRelease);
    //this.on('mouseLeave', this.onMouseRelease);
  },

  onMouseMove: function (event) {console.log('onMouseMove');
    // this.set('parentView.appTouch', true);
    this.set('controller.appTouch', true);

    var node = this.get('activeApp');
    var originEvt = event.originalEvent;
    var offset = node.$().parent().offset(); // TBD
    var x = originEvt.clientX - this.get('offsetX') - offset.left;
    var y = originEvt.clientY - this.get('offsetY') - offset.top;
    node.$().css({ // image follow
      'top': y,
      'left': x,
      'z-index': '100'
    });
    var rowCol = this.getScreenRowCol(x, y);
    if (node.get('row') !== rowCol.row ||
        node.get('col') !== rowCol.col ||
        node.get('scr') !== rowCol.scr) {
      this.shuffle({
        row: node.get('row'),
        col: node.get('col'),
        scr: node.get('scr')
      }, rowCol);
    }
  },

  onMouseRelease: function () {
    var node = this.get('activeApp');
    node.$().removeClass('dragging');
    this.$(document).off('mousemove');
    this.off('mouseUp', this.onMouseRelease);
    // this.off('mouseLeave', this.onMouseRelease);
    node.position(node.get('row'), node.get('col'), node.get('scr'), 300);

    node.$().css({
      'z-index': 1
    });
    if (!this.get('controller.appTouch')) {
      this.get('controller').send('openApp', node.get('content'));
    }
    this.set('controller.appTouch', false);
  },

  shuffle: function (from, to) {  // TBD add screen constrain
    console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
    var isSamePosition = function (pos1, pos2) {
      return get(pos1, 'col') === get(pos2, 'col') &&
      get(pos1, 'row') === get(pos2, 'row') &&
      get(pos1, 'scr') === get(pos2, 'scr');
    }
    this.get('childViews').forEach(function (itemView) {
      if (isSamePosition(itemView, to)) { // swap
        console.log(from);
        itemView.position(get(from, 'row'), get(from, 'col'), get(from, 'scr'), 200);
      } else if (isSamePosition(itemView, from)) { // target
        itemView.setProperties({
          col: get(to, 'col'),
          row: get(to, 'row'),
          scr: get(to, 'scr')
        });
      }
    });
  },



});
