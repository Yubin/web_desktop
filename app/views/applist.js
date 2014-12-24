import Ember from 'ember';
import keyUtils from '../utils/keys';

var KEYS = keyUtils.KEYS;
var get = Ember.get;

export default Ember.CollectionView.extend({
  // templateName: 'appscreen',
  classNames: ['appscreen', 'appscreen-set', 'dropzone'],
  classNameBindings: ['appTouch:background'],
  appTouch: false,
  contentBinding: 'controller',
  tagName: 'ul',
  height: 600,
  width: 400,

  left: 89,
  top: 103,

  itemViewClass: 'appicon',

  activeApp: null,

  init: function () {
    this._super();
    Ember.$(window).resize(function() {

      this.handleSize();
    }.bind(this));
  },

  didInsertElement: function () {
    this.handleSize();
    Ember.$(document).on('keyup.applist', this.onKeyUp.bind(this));
  },

  onKeyUp: function (evt) {
    // key event 27 is the escape key
    if (evt.which === KEYS.LEFT_ARROW || evt.which === KEYS.RIGHT_ARROW) {
      Ember.run(this, function () {
        this.controller.send('moveImage', evt.which);
      });
    }
  },

  handleSize: function () {

    var minHeightIcon = 64;
    var minWidthIcon = 48;
    var minHeightScreen = minHeightIcon * 6;
    var minWidthScreen = minWidthIcon * 4;
    var minHeightWin = minHeightScreen + 60;
    var minWidthWin = minWidthScreen * 4;
    var winWidth  = Math.max(Ember.$(window).width(), minWidthWin);
    var winHeight = Math.max(Ember.$(window).height(), minHeightWin);

    var height = (winHeight - 60) * 0.9;
    var width = winWidth / 3 * 0.9 ;

    var top = (winHeight - 60 - height) / 2 + 45;
    var left = (winWidth - width * 3) / 4;

    var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
    // var node = this.$();
    // node.css({
    //   width: width,
    //   height: height,
    //   left: left,
    //   top: top
    // });
    // node.css({
    //   width: '100%',
    //   height: '100%'
    // });
    this.setProperties({
      screenWidth: width,
      screenHeight: height,
      top: top,
      left: left,
      iconWidth: iconWidth
    });
  },


  getScreenRowCol: function (left, top) { // TBD: refine accuracy
    var newCol = Math.round(left * 4 / this.get('screenWidth'));
    var newRow = Math.round(top * 5 / this.get('screenHeight'));
    return {row: newRow, col: newCol};
  },

  onMouseMove: function (event) {
    // this.set('parentView.appTouch', true);

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
    if (node.get('row') !== rowCol.row || node.get('col') !== rowCol.col) {
      this.shuffle(
        {row: node.get('row'), col: node.get('col')},
        rowCol);
    }
  },

  onMouseRelease: function () {
    var node = this.get('activeApp');
    node.$().removeClass('dragging');
    this.off('mouseMove', this.onMouseMove);
    this.off('mouseUp', this.onMouseRelease);
    // this.off('mouseLeave', this.onMouseRelease);
    node.position(node.get('row'), node.get('col'), 300);

    node.$().css({
      'z-index': 1
    });
    this.set('controller.appTouch', false);
    var timeSpan = (new Date()).getTime() - this.get('startTime');
    if (timeSpan < 300) {
      this.get('controller').send('openApp', node.get('content'));
    }
  },

  onMouseDown: function (app, offsetX, offsetY) { // this will be called by item
    this.setProperties({
      'activeApp': app,
      'offsetX': offsetX,
      'offsetY': offsetY
    });

    this.on('mouseMove', this.onMouseMove);
    this.on('mouseUp', this.onMouseRelease);
    //this.on('mouseLeave', this.onMouseRelease);
    this.set('startTime', (new Date()).getTime());
  },

  shuffle: function (from, to) {  // TBD add screen constrain
    this.get('childViews').forEach(function (itemView) {
      var col = get(itemView, 'col');
      var row = get(itemView, 'row');
      if (col === get(to, 'col') && row === get(to, 'row') ) {
        itemView.position(get(from, 'row'), get(from, 'col'), 200);
      } else if (col === get(from, 'col') && row === get(from, 'row') ) {
        itemView.setProperties({
          col: get(to, 'col'),
          row: get(to, 'row')
        });
      }
    });
  }


});
