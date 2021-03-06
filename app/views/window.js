import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'window',
  classNames: ['window', 'share',  'windows-vis'],

  width: 800,
  height: 600,

  didInsertElement: function () {

    this.$().css({
      width: this.get('width'),
      height: this.get('height')
    });

    this.$('.header').on('mousedown', function (event) {
      var originEvt = event.originalEvent;
      var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
      var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

    //   this.$('.header').on('mousemove', function (event) {
    //     var originEvt = event.originalEvent;
    //     var x = originEvt.clientX - offsetX;
    //     var y = originEvt.clientY - offsetY;
    //     this.$().css({ // image follow
    //       'top': y,
    //       'left': x,
    //       'z-index': '1000'
    //     });
    //   }.bind(this));
    //
    }.bind(this));

    this.$('.header').on('mouseup', function () {console.log('mouseup');
      Ember.$(this).off('mousemove');
    });

  },

  willDestroyElement: function () {
    this.$('.header').on('mousedown');
    this.$('.header').on('mouseup');
  }

});
