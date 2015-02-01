import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['head'],
  templateName: 'header',
  width_dock_icon: 52,
  width_dock_corner: 25,
  width_sync: 66,

  adjustSize: function () {
    var total_dock = this.get('content.dock.length');
    var offset = total_dock ? total_dock * this.get('width_dock_icon') + 2 * this.get('width_dock_corner') : 0;
    var width = (Ember.$( window ).width() - offset - this.get('width_sync')) /2 ;
    if (this.get('_state') === "inDOM") {
      this.$('.left').width(width);
      this.$('.right').width(width);
    }
  }.observes('content.dock.length'),

  init: function() {
    this._super();
    Ember.$(window).bind('resize', function () {
      this.adjustSize();
    }.bind(this));
  },
  didInsertElement: function () {
    this.adjustSize();
  },


});
