import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'li',
  templateName: 'appicon',

  row: function () {
    return this.get('content.row');
  }.property('content.row'),

  col: function () {
    return this.get('content.col');
  }.property('content.col'),

  iconWidth: function () {
    return this.get('parentView.iconWidth');
  }.property('parentView.iconWidth'),


  parentWidth: function () {
    return this.get('parentView.width');
  }.property('parentView.width'),

  parentHeight: function () {
    return this.get('parentView.height');
  }.property('parentView.height'),

  onIconSizeChange: function () {
    this.handleSize();
    this.position();
  }.observes('iconWidth', 'parentWidth','parentHeight'),

  didInsertElement: function () {
    this.handleSize();
    this.position();
  },

  handleSize: function () {
    var iconWidth = this.get('iconWidth');

    this.$('span').css({
      'top': iconWidth + 5 * iconWidth / 60,
      'font-size': 12 + Math.round(iconWidth / 60)
    });

    this.$().css({
      'height': iconWidth,
      'width':  iconWidth,
      'display': 'inline-block',
      'float': 'left'
    });
    this.$('.app-img').css({
      'background': 'url(img/' + this.get('content.imgName') + '.png) no-repeat',
      "background-size": "100%"
    });

  },


  position: function (row, col, duration) {
    row = !Ember.isEmpty(row) ? row : this.get('row');
    col = !Ember.isEmpty(col) ? col : this.get('col');

    var iconWidth = this.get('iconWidth');
    var iconHeight = iconWidth * 4 / 3;

    var offsetHeight = (this.get('parentHeight') - iconHeight * 5) / 6;
    var offsetWidth  = (this.get('parentWidth') - iconWidth * 4) / 5;
    var top  = (iconHeight + offsetHeight) * row + offsetHeight;
    var left = (iconWidth + offsetWidth) * col + offsetWidth;

    if (duration) {
      this.$().animate({
        'top': top,
        'left': left
      }, duration);
    } else {
      this.$().css({
        'top': top,
        'left': left
      });
    }

    this.setProperties({
      row: row,
      col: col
    });
  },

  getScreenRowCol: function (left, top) { // TBD: refine accuracy
    var newCol = Math.round(left * 4 / this.get('parentWidth'));
    var newRow = Math.round(top * 5 / this.get('parentHeight'));
    return {row: newRow, col: newCol};
  },

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

    this.set('parentView.appTouch', true);
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
    this.position(this.get('row'), this.get('col'), 300);

    node.css({
      'z-index': 1
    });
    this.set('parentView.appTouch', false);
    var timeSpan = (new Date()).getTime() - this.get('startTime');
    if (timeSpan < 300) {
      this.get('parentView.controller').send('openApp', this.get('content'));
    }
  }


});
