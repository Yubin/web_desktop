import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  // templateName: 'appscreen',
  classNames: ['appscreen', 'appscreen-set', 'dropzone'],
  classNameBindings: ['appTouch:background', 'hasApp', ':fadeIn-50ms', ':animated', 'hasApp:fadeIn:fadeOut'],
  appTouch: false,
  hasApp: false,

  init: function () {
    this._super();
    Ember.$(window).resize(function() {
      this.handleSize();
    }.bind(this));
  },

  didInsertElement: function () {
    this.handleSize();
  },

  willDestroyElement: function() {
    var clone = this.$().clone();
    this.$().parent().append(clone);
    clone.fadeOut();
  },

  handleSize: function () {
    var node = this.$();
    var index = this.get('index') || 0;
    var width = this.get('parentView.screenWidth');
    var widthOffset = this.get('parentView.widthOffset');
    var left = index * (width + widthOffset) + widthOffset;
    if (node) {
      this.$().css({
        top: 0,
        left: left,
        width: width,
        height: this.get('parentView.screenHeight')
      });
    }
  }.observes('parentView.screenWidth',
    'parentView.screenHeight',
    'parentView.screenTop',
    'parentView.widthOffset')

});
