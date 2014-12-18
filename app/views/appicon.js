import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'li',
  templateName: 'appicon',

  height: 60,
  width: 60,

  offsetHeight: 50,
  offsetWidth: 20,

  row: function () {
    return this.get('content.row');
  }.property('content.row'),

  col: function () {
    return this.get('content.col');
  }.property('content.col'),

  parentWidth: function () {
    return this.get('parentView').$().width();
  }.property(),

  parentHeight: function () {
    return this.$().parent().height();
  }.property(),

  init: function () {
    this._super();
    // Ember.$(window).resize(function() {
    //
    //   this.handleSize();
    // }.bind(this));
  },

  didInsertElement: function () {
    this.handleSize();
  },

  handleSize: function () {
    var iconHeight = this.get('height');
    var iconWidth = this.get('width');

    this.$().css({
      'height': iconHeight,
      'width':  iconWidth,
      'display': 'inline-block',
      'float': 'left'
    });
    this.$('.app-img').css({
      'background': 'url(img/' + this.get('content.imgName') + '.png) no-repeat',
      "background-size": "100%"
    });
    this.position();
  },


  position: function (row, col) {
    row = !Ember.isEmpty(row) ? row : this.get('row');
    col = !Ember.isEmpty(col) ? col : this.get('col');

    var offsetHeight = this.get('parentHeight') / 5;
    var offsetWidth = this.get('parentWidth') / 4;
    var top = offsetHeight * row;
    var left = offsetWidth * col;

    this.$().animate({
      'top': top,
      'left': left
    });

    this.setProperties({
      row: row,
      col: col
    });
  },

  getScreenRowCol: function (left, top) {
    var newCol = Math.round(left * 4 / this.get('parentWidth'));
    var newRow = Math.round(top * 5 / this.get('parentHeight'));
    return {row: newRow, col: newCol};
  },
  // dragStart: function (event) {
  //   this.$().addClass('dragging');
  //   console.log(event.originalEvent);
  // },
  //
  // dragEnd: function () {
  //   this.$().removeClass('dragging');
  // },
  mouseDown: function (event) {
    var originEvt = event.originalEvent;
    this.setProperties({
      offsetX: originEvt.offsetX ? originEvt.offsetX : originEvt.layerX,
      offsetY: originEvt.offsetY ? originEvt.offsetY : originEvt.layerY
    });

    this.$().addClass('dragging');

    this.on('mouseMove', this.onMouseMove);
    this.on('mouseUp', this.onMouseRelease);
    this.on('mouseLeave', this.onMouseRelease);
    this.set('startTime', (new Date()).getTime());
  },

  onMouseMove: function (event) {
    var originEvt = event.originalEvent;
    var offset = this.$().parent().offset();
    var x = originEvt.clientX - this.get('offsetX') - offset.left;
    var y = originEvt.clientY - this.get('offsetY') - offset.top;
    this.$().css({ // image follow
      'top': y,
      'left': x,
      'z-index': '100'
    });
    var rowCol = this.getScreenRowCol(x, y);
    if (this.get('row') !== rowCol.row || this.get('col') !== rowCol.col) {
      this.get('parentView').shuffle(
        {row: this.get('row'), col: this.get('col')},
        rowCol);
    }
  },


  onMouseRelease: function () {
    var node = this.$();
    node.removeClass('dragging');
    this.off('mouseMove', this.onMouseMove);
    this.off('mouseUp', this.onMouseRelease);
    this.off('mouseLeave', this.onMouseRelease);
    this.position();

    node.css({
      'z-index': 1
    });

    var timeSpan = (new Date()).getTime() - this.get('startTime');
    if (timeSpan < 300) {
      this.get('parentView.controller').send('openApp', this.get('content'));
    }
  }


});
