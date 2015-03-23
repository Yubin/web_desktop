import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'appicon',
  classNames: ['appicon'],
  attributeBindings : [ 'draggable' ],
  // draggable         : 'true',
  row: function () {
    return this.get('content.row');
  }.property('content.row'),

  col: function () {
    return this.get('content.col');
  }.property('content.col'),

  scr: function () {
    return this.get('content.screen');
  }.property('content.screen'),

  iconWidth: function () {
    return this.get('parentView.iconWidth');
  }.property('parentView.iconWidth'),

  parentWidth: function () {
    return this.get('parentView.screenWidth');
  }.property('parentView.screenWidth'),

  parentHeight: function () {
    return this.get('parentView.screenHeight');
  }.property('parentView.screenHeight'),

  onIconSizeChange: function () {
    this.handleSize();
    this.position();
  }.observes('iconWidth', 'parentWidth','parentHeight'),

  didInsertElement: function () {
    this.$().draggable({
      containment: 'body',
      start: function(evt) {
        this.$().addClass('dragging');
        this.get('parentView').onDragStart(this, evt);
      }.bind(this),
      stop: function (evt) {
        Ember.run.later(function () {
          this.$().removeClass('dragging');
          this.get('parentView').onDragStop(this, evt);
        }.bind(this), 100);
      }.bind(this),
      drag: function (evt) {
        this.get('parentView').onDraging(this, evt);
      }.bind(this)

    });
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
      'background': 'url(' + this.get('content.icon') + ') no-repeat',
      "background-size": "100%"
    });
  },

  index2position: function (row, col, scr) {
    var iconWidth = this.get('iconWidth');
    var iconHeight = this.get('iconWidth') * 1.333;

    var screenWidth = this.get('parentView.screenWidth');
    var screenHeight = this.get('parentView.screenHeight');

    var offsetWidth  = (screenWidth - iconWidth * 4) / 5;
    var offsetHeight = (screenHeight - iconHeight * 5) / 6;

    var widthOffset = this.get('parentView.widthOffset');
    var screenLeft = scr * (screenWidth + widthOffset) + widthOffset;

    return {
      top: (iconHeight + offsetHeight) * row + offsetHeight,
      left: (iconWidth + offsetWidth) * col + offsetWidth + screenLeft
    };
  },

  position: function (row, col, scr, duration) {
    row = !Ember.isEmpty(row) ? row : this.get('row');
    col = !Ember.isEmpty(col) ? col : this.get('col');
    scr = !Ember.isEmpty(scr) ? scr : this.get('scr');

    var position = this.index2position(row, col, scr);
    var top = position.top;
    var left = position.left;

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
      'content.row': row,
      'content.col': col,
      'content.screen': scr
    });
  },

  position2index: function (left, top) {
    var iconWidth = this.get('iconWidth');
    var iconHeight = this.get('iconWidth') * 1.333;
    var screenWidth = this.get('parentView.screenWidth');
    var screenHeight = this.get('parentView.screenHeight');
    var offsetWidth  = (screenWidth - iconWidth * 4) / 5;
    var offsetHeight = (screenHeight - iconHeight * 5) / 6;

    var widthOffset = this.get('parentView.widthOffset');

    var screenLeft = screenWidth + widthOffset;

    var newScr = 0;
    for (var i = 0 ; i < 3; i++) {
      if (left + iconWidth/2 >= screenLeft * i + widthOffset && left + iconWidth/2 < screenLeft * (i + 1) + widthOffset) {
        newScr = i;
      }
    }

    var newCol = Math.round((left - offsetWidth/2 - newScr * screenLeft - widthOffset) * 4 / screenWidth);
    var newRow = Math.round((top - offsetHeight/2) * 5 / screenHeight);

    newCol = newCol < 0 ? 0: newCol;
    newCol = newCol > 3 ? 3: newCol;
    return {row: newRow, col: newCol, scr: newScr};
  },

  click: function () {
    var dragging = this.$().hasClass('dragging');
    if (!dragging) {
      this.get('controller').send('openApp', this.get('content'));
    }
  }

});
