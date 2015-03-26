import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['window', 'windows-vis', 'flipper', 'fadeIn', 'fadeIn-20ms'],
  classNameBindings: ['active'],
  active: true,
  width: 950,
  height: 600,
  left: 0,
  top: 0,

  minWidth: 600,
  minHeight: 450,

  layoutName: 'window',
  isFullSize: false,
  isMinSize: false,

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

  showMinimizedApp: function () {
    if (this.get('isMinSize')) {
      if (this.get('isFullSize')) { // for windows that originally is full sized.
        this.$().animate({
          'top': 45,
          'left': 0,
          'width': '100%',
          'height': '100%'
        });
      }
      else { // for windows that originally is NOT full sized.
        this.$().animate({
          'top': this.get('top'),
          'left': this.get('left'),
          'width': this.get('width'),
          'height': this.get('height')
        });
      }
      this.$().css({
        'boxShadow': '0px 0px 10px 1px black'
      });
      this.isMinSize = false;
    }
    else { // minimize the windows to dock
      if (this.$().hasClass('active')) { // only minimize those are already activated
        this.$().animate({
          'top': 45,
          'left': '50%',
          'width': 0,
          'height': 0
        });
        this.$().css({
          'boxShadow': '0px 0px 0px 0px black'
        });
        this.isMinSize = true;
      }
    }
/*    this.toggleProperty('isMinSize');*/
  },

  mouseDown: function () {
    this.changeZindex();
  },

  click: function () {
    this.get('parentView').send('activateWindow', this.get('content'));
  },

  didInsertElement: function () {
    this.changeZindex();
    this.$().css({
      width: this.get('width'),
      height: this.get('height'),
      left: this.get('left'),
      top: this.get('top')
    });
    this.$().resizable({
      minHeight: this.get('minHeight'),
      minWidth: this.get('minWidth'),
      start: function () {
        Ember.$('#ui_maskLayer_0').css({
          display: 'block'
        });
      },
      stop: function( event, ui ) {
        var size = ui.size;
        this.setProperties({
          width: size.width,
          height: size.height
        });
        Ember.$('#ui_maskLayer_0').css({
          display: 'none'
        });
      }.bind(this)
    });
    this.$().draggable({
      start: function () {
        Ember.$('#ui_maskLayer_0').css({
          display: 'block'
        });
      },
      stop: function(event, ui) {
        var position = ui.position;
        this.setProperties({
          top: position.top,
          left: position.left
        });
        Ember.$('#ui_maskLayer_0').css({
          display: 'none'
        });
      }.bind(this)
    });

    this.$('.header').on('dblclick', function () {
      this._actions['maximizeApp'].apply(this);
    }.bind(this));

    this.$(window).resize(function() {
      Ember.run.debounce(function () {
        if (this.get('isFullSize')) {
          var max_height = this.$(window).height() - 47;
          var max_width = this.$(window).width();
          this.$().css({ // image follow
            'width': Math.max(max_width, this.get('minWidth')),
            'height': Math.max(max_height, this.get('minHeight'))
          });
        }
      }.bind(this), 500);
    }.bind(this));
  },

  willDestroyElement: function () {
    this.$('.header').off('dblclick');
  },

  showFliped: function () {
    var fliped = this.get('fliped');
    if (fliped) {
      // Get List
      this.$().addClass('fliped');

    } else {
      this.$().removeClass('fliped');
    }
  }.observes('fliped'),

  actions: {
    maximizeApp: function () {
      var max_height = this.$(window).height() - 47;
      var max_width = this.$(window).width();
      if (this.get('isFullSize')) {
        this.$().animate({
          'top': this.get('top'),
          'left': this.get('left'),
          'width': this.get('width'),
          'height': this.get('height')
        });
      } else {
        this.$().animate({ // image follow
          'top': 47,
          'left': 0,
          'width': max_width,
          'height': max_height
        });
      }
      this.toggleProperty('isFullSize');
    },

    minimizeApp: function () {
      if (this.get('isMinSize')) {
        this.$().animate({ // image follow
          'top': this.get('top'),
          'left': this.get('left'),
          'width': this.get('width'),
          'height': this.get('height')
        });
        this.$().css({
          'boxShadow': '0px 0px 10px 1px black'
        });
      } else {
        this.$().animate({ // image follow
          'top': 45,
          'left': '50%',
          'width': 0,
          'height': 0,
        });
        this.$().css({
          'boxShadow': '0px 0px 0px 0px black'
        });
      }
      this.toggleProperty('isMinSize');
    },

    flipApp: function () {
      this.set('fliped', false);
    }
  }

});
