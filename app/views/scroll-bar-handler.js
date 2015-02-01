import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['jspDrag'],

  onLenChange: function () {

    var len = this.get('len')||0;
    var top = this.get('top')||0;

    this.$().css({
      height: len + 'px',
      top: top +'px'
    });
  }.observes('len', 'top'),

  mouseEnter: function () {
    this.$().addClass('jspHover');
  },

  mouseLeave: function () {
    this.$().removeClass('jspHover');
  },

  mouseDown: function (evt) {
    this.$().addClass('jspActive');
    this.get('parentView').jspActive(evt);
  },

  mouseUp: function () {
    this.$().removeClass('jspActive');
    this.get('parentView').jspDeactive();
  },



});
