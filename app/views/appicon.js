import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'li',
  templateName: 'appicon',
  attributeBindings : [ 'draggable' ],
  draggable         : 'true',


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
    this.$().draggable();
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
      'background': 'url(' + this.get('content.imgName') + ') no-repeat',
      "background-size": "100%"
    });
  },


  position: function (row, col, scr, duration) {
    row = !Ember.isEmpty(row) ? row : this.get('row');
    col = !Ember.isEmpty(col) ? col : this.get('col');
    scr = !Ember.isEmpty(scr) ? scr : this.get('scr');
    var iconWidth = this.get('iconWidth');
    var iconHeight = this.get('parentView.iconHeight');
    var offsetHeight = this.get('parentView.offsetHeight');
    var offsetWidth  = this.get('parentView.offsetWidth');

    var screnWidth = this.get('parentView.screenWidth');
    var widthOffset = this.get('parentView.widthOffset');
    var screenLeft = scr * (screnWidth + widthOffset + 10) + widthOffset;

    var top  = (iconHeight + offsetHeight) * row + offsetHeight;
    var left = (iconWidth + offsetWidth) * col + offsetWidth + screenLeft;

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

  mouseDown: function (event) {
    var originEvt = event.originalEvent;
    var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
    var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

    this.$().addClass('dragging');
    this.get('parentView').onMouseDown(this, offsetX, offsetY);
  },

  mouseUp: function (evt) {
    this.$().removeClass('dragging');
    return true;
  }

});
