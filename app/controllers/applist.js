import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var isEmpty = Ember.isEmpty;

export default Ember.Controller.extend({
  // itemController: 'applist-item',
  needs: ['application'],
  screenNum: 3,
  screens: [
  { id: 0, hasApp: false},
  { id: 1, hasApp: false},
  { id: 2, hasApp: false}
  ],

  appTouch: false,

  openApps: [],

  installApps: Ember.computed.alias('controllers.application.user.installApps'),

  init: function () {
    this._super.apply(this, arguments);
  },

  reset: function () {
    // close all open apps
    this.get('openApps').forEach(function (app) {
      this._actions['closeApp'].apply(this, [app]);
    }.bind(this));

    // clear properties
    this.setProperties({
      openApps: []
    });
  },

  appScreenChange: function () {
    var apps = this.get('content');
    var screens = this.get('screens');
    screens.forEach(function (scr) {
      var index = get(scr, 'id');
      var hasApp = apps.any(function (app) {

        return get(app, 'screen') === index;
      });
      set(scr, 'hasApp', hasApp);
    });
  }.observes('content.@each.screen'),

  loadInstallApps: function () {
    var installApps = this.get('installApps');

    if (!isEmpty(installApps)) {
      var ids = installApps.filterBy('id');

      this.store.findQuery('app-info', {ids: ids}).then(function (res) {
        var apps = res.get('content');
        if (apps) {
          apps.forEach(function (app) {
            var obj = installApps.findBy('id', parseInt(app.get('id')));
            if (obj && obj.location) {
              var array = obj.location.split(',');
              app.set('screen', parseInt(array[0]));
              app.set('row', parseInt(array[1]));
              app.set('col', parseInt(array[2]));
            }
            this.get('model').pushObject(app);
          }.bind(this));
        }
      }.bind(this));

    }
  }.observes('installApps'),

  observeAppinstall: function () {
    // Send install APP
  }.observes('appinstall'),

  actions: {
    showTrash: function (show) {
      this.set('appTouch', show);
    },
    openApp: function (item) { console.log(item);
      var name = get(item, 'name');
      var icon = get(item, 'icon');
      var find = this.get('openApps').any(function (it) {
        return get(it, 'name') === name;
      });

      if (!find) {
        var viewName = get(item, 'viewName') || 'customer';
        var viewType = 'app.' + viewName;
        var klass = this.container.lookupFactory('view:' + viewType);
        var length = this.get('openApps').length;
        var top = 125 + 30 * length;
        var left = 250 + 30 * length;
        if (klass) {
          var instant = klass.create({
            top: top,
            left: left,
            content:    item,
            parentView: this,
            container:  this.container
          }).appendTo('body');
          this.get('openApps').pushObject({name: name, icon: icon, instant: instant});
        }
      } else {
          var obj = this.get('openApps').findBy('name', name);
          // if user clicks a app icon and the app has been minimized
          if (obj.instant.get('isMinSize')) {
            obj.instant.showMinimizedApp();
          }
          // if user clicks a app icon and the app is not on top
          obj.instant.changeZindex();
      }
    },

    closeApp: function (item) {
      var name = get(item, 'name');
      var obj = this.get('openApps').findBy('name', name);

      if (Ember.isEmpty(obj)) {
        return;
      }
      var instant = get(obj, 'instant');
      if (instant) {
        this.get('openApps').removeObject(obj);
        instant.destroy();
      }

      var mostTopApp = null;
      var mostTopZindex = -1;
      this.get('openApps').forEach(function (app) {
        var instant = app.instant;
        var zindex = parseInt(Ember.$(instant.get('element')).css("z-index"));
        if (zindex > mostTopZindex) {
          mostTopZindex = zindex;
          mostTopApp = instant;
        }
      });
      if (mostTopApp) {
        mostTopApp.changeZindex();
      }
    },

    addApp: function (content) {
      var screen = 0;
      var col = 0;
      var row = 0;

      var tmp = [];
      var tmp1 = [];

      var apps  = this.get('model');
      var screenFilter = function (app) {
        return get(app, 'screen') === screen;
      };
      var colFilter = function (app) {
        return get(app, 'col') === col;
      };
      var rowFilter = function (app) {
        return get(app, 'row') === row;
      };

      for (screen = 0; screen < 3; screen ++) {
        tmp = apps.filter(screenFilter);
        if (tmp.length < 20) {
          break;
        }
      }
      for (col = 0; col < 4; col ++) {
        tmp1 = tmp.filter(colFilter);
        if (tmp1.length < 5) {
          break;
        }
      }
      for (row = 0; row < 5; row ++) {
        var find = tmp1.any(rowFilter);
        if (!find) {
          break;
        }
      }

      apps.pushObject(
        Ember.$.extend({
          screen: screen,
          col: col,
          row: row
        }, content));
    },

    deleteApp: function (content) {
      this._actions['closeApp'].apply(this, [content]);
      var apps  = this.get('model');
      apps.removeObject(content);
      console.log(content);
    },

    moveImage: function (key) {
      console.log('moveImage' + key);
    },

    activateWindow: function (/*content*/) {
      console.log('activateWindow');
    }

  }
});
