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
    console.log("showMinimizedApp:" + this.$().hasClass('active'));
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
      })
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
        })
        this.isMinSize = true;
      }
    }
/*    this.toggleProperty('isMinSize');*/
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
    this.$('.header').on('mouseup', function () {
      // update position info, so when show app from minimize, it goes original place
      var window_position=this.$().position();
      console.log("window-x:" + window_position.left + ", window-y:" + window_position.top);
      this.top = window_position.top; 
      this.left = window_position.left;
      this.width = this.$().width();
      this.height = this.$().height();
      this.$(document).off('mousemove');
    }.bind(this));
    this.$().resize(function() {
      console.log("resized");
      // update position info, so when show app from minimize, it goes original place
      var window_position=this.$().position();
      console.log("window-x:" + window_position.left + ", window-y:" + window_position.top);
      this.top = window_position.top; 
      this.left = window_position.left;
      this.width = this.$().width();
      this.height = this.$().height();
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
      if (this.get('isMinSize')) {
        this.$().animate({ // image follow
          'top': this.get('top'),
          'left': this.get('left'),
          'width': this.get('width'),
          'height': this.get('height')
        });
        this.$().css({
          'boxShadow': '0px 0px 10px 1px black'
        })
      } else {
        this.$().animate({ // image follow
          'top': 45,
          'left': '50%',
          'width': 0,
          'height': 0,
        });
        this.$().css({
          'boxShadow': '0px 0px 0px 0px black'
        })
      }
      this.toggleProperty('isMinSize');
    }
  }

});
