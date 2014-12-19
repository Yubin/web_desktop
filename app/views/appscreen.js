import Ember from 'ember';

var get = Ember.get;

export default Ember.CollectionView.extend({
  // templateName: 'appscreen',
  classNames: ['appscreen', 'appscreen-set', 'dropzone'],
  classNameBindings: ['appTouch:background'],
  appTouch: false,
  tagName: 'ul',
  height: 600,
  width: 400,

  left: 89,
  top: 103,

  itemViewClass: 'appicon',

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
    var node = this.$();
    node.css({
      width: width,
      height: height,
      left: left,
      top: top
    });

    this.setProperties({
      width: width,
      height: height,
      top: top,
      left: left,
      iconWidth: iconWidth
    });
  },

  shuffle: function (from, to) {
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
  },

  onAppTouch: function () {
    this.get('controller').send('showTrash', this.get('appTouch'));
  }.observes('appTouch')


});
