import Ember from 'ember';

var get = Ember.get;

export default Ember.CollectionView.extend({
  // templateName: 'appscreen',
  classNames: ['appscreen', 'appscreen-set', 'dropzone'],
  tagName: 'ul',
  height: 600,
  width: 400,
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
    var node = this.$();
    node.css({
      padding: '26px 16px',
      width: this.get('width'),
      height: this.get('height'),
      left: '89px',
      top: '103px',
    });
  },

  shuffle: function (from, to) {
    this.get('childViews').forEach(function (itemView) {
      var col = get(itemView, 'col');
      var row = get(itemView, 'row');
      if (col === get(to, 'col') && row === get(to, 'row') ) {
        itemView.position(get(from, 'row'), get(from, 'col'));
      } else if (col === get(from, 'col') && row === get(from, 'row') ) {
        itemView.setProperties({
          col: get(to, 'col'),
          row: get(to, 'row')
        });
      }
    });
  }


});
