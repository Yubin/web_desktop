import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  templateName: 'applist',
  classNames: ['applist'],

  height: 600,
  width: 400,

  left: 89,
  top: 103,

  deleting: 0,

  init: function () {
    this._super();
    Ember.$(window).resize(function() {
      this.handleSize();
    }.bind(this));
  },

  didInsertElement: function () {
    this.handleSize();
  },

  handleSize: function () {

    var minWidthIcon = 48;
    // var minHeightWin = 600;
    // var minWidthWin = 800;
    var winWidth  = Ember.$(window).width() ;
    var winHeight = Ember.$(window).height();

    var paddingRate = 0.04;
    var paddingTop = winHeight * paddingRate;

    var top = Ember.$('.ember-view.head').height() +
      Ember.$('.ember-view.search-bar .search').height() + 2 * paddingTop;
    var node = this.$();
    if (node) {
      this.$().css({
        top: top,
        bottom: 0,
        left: 0,
        right: 0
      });
    }
    var height = (winHeight - top) * (1 - 2 * paddingRate);
    var width = winWidth / 3 * 0.86 ;
    var widthOffset = (winWidth - 3 * (width)) / 4;
    var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
    var iconHeight = iconWidth * 4 / 3;


    this.setProperties({
      screenWidth:  width,
      screenHeight: height,
      widthOffset:  widthOffset,
      iconWidth:    iconWidth,
      iconHeight:   iconHeight
    });
  },

  onDragStart: function (node, evt) {
    var originEvt = evt.originalEvent;
    var offset = node.$().parent().offset();
    var offsetX = originEvt.offsetX ? originEvt.offsetX : evt.clientX - $(evt.target).offset().left;
    var offsetY = originEvt.offsetY ? originEvt.offsetY : evt.clientY - $(evt.target).offset().top;
    var x = originEvt.clientX - offsetX - offset.left;
    var y = originEvt.clientY - offsetY - offset.top;
    this.setProperties({
      'activeApp': node,
      'offsetX': offsetX,
      'offsetY': offsetY
    });
    this.$('.hint').css({ // image follow
      'top': y,
      'left': x,
      'z-index': 99
    });
    this.$('.hint').show();
  },
  //
  onDraging: function (node, event) {
    this.get('controller').send('appMoving');
    var originEvt = event.originalEvent;
    var offset = node.$().parent().offset(); // TBD
    var x = originEvt.clientX - this.get('offsetX') - offset.left;
    var y = originEvt.clientY - this.get('offsetY') - offset.top;
    node.$().css({ // image follow
      'z-index': '100'
    });
    Ember.run.debounce(function () {
      var rowCol = node.position2index(x, y);
      var row = rowCol.row;
      var col = rowCol.col;
      var scr = rowCol.scr;

      if (row >= 0){
        var position = node.index2position(row, col, scr);
        this.$('.hint').css({ // image follow
          'top': position.top,
          'left': position.left,
          'z-index': 99
        });

        if (node.get('row') !== row ||
            node.get('col') !== col ||
            node.get('scr') !== scr) {
          this.shuffle({
            row: node.get('row'),
            col: node.get('col'),
            scr: node.get('scr')
          }, rowCol);
        }
      }
    }.bind(this), 100);

  },
  onDragStop: function (node) {
    if (node) {
      node.position(node.get('row'), node.get('col'), node.get('scr'), 100);
      node.$().css({
        'z-index': 1
      });
    }
    this.$('.hint').hide();
    this.get('controller').send('appStop');
  },

  shuffle: function (from, to) {  // TBD add screen constrain
    console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
    var isSamePosition = function (pos1, pos2) {
      return get(pos1, 'col') == get(pos2, 'col') &&
      get(pos1, 'row') == get(pos2, 'row') &&
      get(pos1, 'scr') == get(pos2, 'scr');
    };
    var itemTarget = this.get('childViews').find(function (itemView) {
      return isSamePosition(itemView, to);
    });
    var itemOrigin = this.get('childViews').find(function (itemView) {
      return isSamePosition(itemView, from);
    });

    if (itemTarget) {
      itemTarget.position(get(from, 'row'), get(from, 'col'), get(from, 'scr'), 200);
    }
    if (itemOrigin) {
      itemOrigin.setProperties({
        'content.col': get(to, 'col'),
        'content.row': get(to, 'row'),
        'content.screen': get(to, 'scr')
      });
    }
  }
});
