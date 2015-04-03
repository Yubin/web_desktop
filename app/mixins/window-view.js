import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

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

  linkAppObject: {},
  linkOriginApp: null,
  appLinkables: [],

  changeZindex: function () {
    this.set('active', true);

    var zindex = -1;
    Ember.$('.window').each(function (index, item) {
      var node = Ember.$(item);
      var z = parseInt(node.css('z-index'));
      if (z > zindex) {
        zindex = z;
      }
      var view = Ember.View.views[node.attr('id')];
      if (view !== this) {
        view.set('active', false);
      }
    }.bind(this));

    this.$().css('z-index', zindex + 1);
  },

  onActiveChange: function () {
    var display = this.get('active') ? 'none' : 'block';
    this.$('.iframeDragResizeMask').css({
      display: display
    });
  }.observes('active'),

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

  click: function () {
    this.changeZindex();
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
        this.$('.iframeDragResizeMask').css({
          display: 'block'
        });
      }.bind(this),
      stop: function( event, ui ) {
        var size = ui.size;
        this.setProperties({
          width: size.width,
          height: size.height
        });
        this.$('.iframeDragResizeMask').css({
          display: 'none'
        });
      }.bind(this)
    });
    this.$().draggable({
      start: function () {
        this.$('.iframeDragResizeMask').css({
          display: 'block'
        });
      }.bind(this),
      stop: function(event, ui) {
        var position = ui.position;
        this.setProperties({
          top: position.top,
          left: position.left
        });
        this.$('.iframeDragResizeMask').css({
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
    var appLinkables = this.get('appLinkables');
    appLinkables.clear();

    var linkAppObject = this.get('linkAppObject');

    if (linkAppObject) {
      // Get List
      var allApps = this.get('parentView.model');
      var app = allApps.findBy('name', get(linkAppObject, 'appId'));
      if (app && get(app, 'input_service')) {
        this.set('linkOriginApp', app);
        var idArray = get(app, 'input_service').split(',');
        var linked = get(app, 'linked');
        allApps.forEach(function (item) {
          var id = get(item, 'id');
          if (idArray.indexOf(id) > -1) { // in white list
            var hasLinked = false;
            if (linked && linked.indexOf(id) > -1) { // linked
              hasLinked = true;
            }
            appLinkables.pushObject({
              id: get(item, 'id'),
              name: get(item, 'name'),
              icon: get(item, 'icon'),
              hasLinked: hasLinked
            });
          }
        });
      }
    }
    this.$().addClass('fliped');

  }.observes('linkAppObject'),

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
      this.$().removeClass('fliped');
      var linkedApps = this.get('appLinkables').filterBy('hasLinked', true);
      var ids = linkedApps.mapBy('id');
      console.log(ids);
      this.set('linkOriginApp.linked', ids);
      var payload = {
        op: 'selectLink',
        targetApp: linkedApps
      };
      this.$('iframe')[0].contentWindow.postMessage(payload, this.get('linkAppObject.eventOrigin'));
    },

    link: function (content) {
      set(content, 'hasLinked', true);
    },

    unlink: function (content) {
      set(content, 'hasLinked', false);
    }
  }

});
