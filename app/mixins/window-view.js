import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['window', 'windows-vis', 'fadeIn', 'fadeIn-20ms'],
  classNameBindings: ['active'],
  active: true,
  width: 950,
  height: 600,
  left: 0,
  top: 0,
  layoutName: 'window',
  isFullSize: false,

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
    this.$().resizable();
      this.$().draggable();
      this.$('.header').on('dblclick', function () {
        this._actions['maximizeApp'].apply(this);
      }.bind(this));
    // this.$('.header').on('mousedown', function (event) {
    //   if (event.which !== 1) { return ;}
    //   var originEvt = event.originalEvent;
    //   var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
    //   var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;
    //
    //   this.$(document).on('mousemove', function (event) {
    //     var originEvt = event.originalEvent;
    //     var x = originEvt.clientX - offsetX;
    //     var y = originEvt.clientY - offsetY;
    //     this.$().css({ // image follow
    //       'top': y,
    //       'left': x
    //     });
    //     this.setProperties({
    //       top: y,
    //       left: x
    //     });
    //   }.bind(this));
    //
    // }.bind(this)).on('dblclick', function () {
    //   this._actions['maximizeApp'].apply(this);
    // }.bind(this));

    this.$('.header').on('mouseup', function () {console.log('mixin -  mouseup');
      this.$(document).off('mousemove');
    }.bind(this));

  },

  willDestroyElement: function () {
    this.$('.header').off('dblclick');
  },

  actions: {
    maximizeApp: function () {
      if (this.get('isFullSize')) {
        this.$().animate({ // image follow
          'top': this.get('top'),
          'left': this.get('left'),
          'width': this.get('width'),
          'height': this.get('height')
        });
      } else {
        this.$().animate({ // image follow
          'top': 45,
          'left': 0,
          'width': '100%',
          'height': '100%'
        });
      }
      this.toggleProperty('isFullSize');
    },

    minimizeApp: function () {
      //TBD
    }
  }

});
