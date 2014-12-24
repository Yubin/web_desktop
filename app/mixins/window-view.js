import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['window', 'share',  'windows-vis'],

  width: 800,
  height: 500,

  changeZindex: function () {
    var zindex = -1;
    Ember.$('.window').each(function () {
      var z = parseInt(Ember.$(this).css('z-index'));
      if (z > zindex) {
        zindex = z;
      }
    });

    this.$().css('z-index', zindex + 1);
  },

  mouseDown: function () {
    this.changeZindex();
  },

  didInsertElement: function () {
    this.changeZindex();
    this.$().css({
      width: this.get('width'),
      height: this.get('height')
    });

    this.$('.header').on('mousedown', function (event) {
      var originEvt = event.originalEvent;
      var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
      var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

      this.$(document).on('mousemove', function (event) {
        var originEvt = event.originalEvent;
        var x = originEvt.clientX - offsetX;
        var y = originEvt.clientY - offsetY;
        this.$().css({ // image follow
          'top': y,
          'left': x
        });
      }.bind(this));

    }.bind(this));

    this.$('.header').on('mouseup', function () {
      this.$(document).off('mousemove');
    }.bind(this));

  },

  willDestroyElement: function () {
    this.$('.header').on('mousedown');
    this.$('.header').on('mouseup');
  }

});
