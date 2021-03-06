import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['window', 'windows-vis'],
  classNameBindings: ['active'],
  active: true,
  width: 800,
  height: 500,
  left: 0,
  top: 0,

  changeZindex: function () {
    var zindex = -1;
    Ember.$('.window').each(function () {
      var z = parseInt(Ember.$(this).css('z-index'));
      if (z > zindex) {
        zindex = z;
      }
      Ember.$(this).removeClass('active');
    });

    this.$().css('z-index', zindex + 1);
    this.$().addClass('active');
  },

  mouseDown: function () {
    this.changeZindex();
  },

  // click: function () {
  //   this.get('parentView').send('activateWindow', this.get('content'));
  // },

  didInsertElement: function () {
    this.changeZindex();
    this.$().css({
      width: this.get('width'),
      height: this.get('height'),
      left: this.get('left'),
      top: this.get('top')
    });

    this.$('.header').on('mousedown', function (event) {
      if (event.which !== 1) { return ;}
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

    this.$('.header').on('mouseup', function () {console.log('mixin -  mouseup');
      this.$(document).off('mousemove');
    }.bind(this));

  },

  willDestroyElement: function () {
    this.$('.header').off('mousedown');
    this.$('.header').off('mouseup');
  }

});
