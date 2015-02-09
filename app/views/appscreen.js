import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  // templateName: 'appscreen',
  classNames: ['appscreen', 'appscreen-set', 'dropzone', 'fadeIn', 'fadeIn-50ms','fadeIn-Delay-50ms'],
  classNameBindings: ['appTouch:background', 'hasApp'],
  appTouch: false,
  hasApp: false,

  init: function () {
    this._super();
    Ember.$(window).resize(function() {
      this.handleSize();
    }.bind(this));
  },

  handleSize: function () {
    var index = this.get('index') || 0;
    var width = this.get('parentView.screenWidth');
    var widthOffset = this.get('parentView.widthOffset');
    var left = index * (width + widthOffset) + widthOffset;
    this.$().css({
      top: this.get('parentView.screenTop'),
      left: left,
      width: width,
      height: this.get('parentView.screenHeight')
    });
  }.on('didInsertElement')


});
