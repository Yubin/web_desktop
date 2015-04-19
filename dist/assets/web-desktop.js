/* jshint ignore:start */

/* jshint ignore:end */

define('web-desktop/adapters/app-info', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/app-info', 'ember'], function (exports, Adapter, Serializer, Ember) {

  'use strict';

  var isEmpty = Ember['default'].isEmpty;

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    findQuery: function (store, type, query) {
      var url = this.buildURL();
      // Get on id = 2 or id = 3
      var ids = query.ids;
      var onStr = '';
      if (!isEmpty(ids)) {
        if (ids.length && ids.length > 1) { // TBD Array
          onStr = ids.map(function(i){return 'id='+i;}).join(' or ');
        } else { // only one
          onStr = 'id=' + ids;
        }
      } else { // Get All!

      }

      onStr = onStr ? 'ON ' + onStr : '';
      console.log(onStr);

      var requestStr = 'GET ' + onStr;
      return this.ajax(url, 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'UserAppInfo'
      });
    }

  });

});
define('web-desktop/adapters/base', ['exports', 'ember-data', 'ember'], function (exports, DS, Ember) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({

    buildURL: function (/*type, id*/) {
      return 'http://asa.gausian.com/';
    },

    ajax: function (rawUrl, type, rawHash) {
      var adapter = this;
      var userAppId = rawHash.userAppId || 'Fl2GDgDECXcbmJsBAJVayUhuLwkAAAA;'; // app_id
      var serviceAppName = rawHash.serviceAppName ;// Login
      var requestString = rawHash.data.requestString;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var hash = {},
          url = rawUrl;
        hash.type = type;
        hash.dataType = 'json';
        hash.context = adapter;
        hash.data = 'user_app_id=%@&service_app_name=%@&request_string=%@'
          .fmt(userAppId, serviceAppName, requestString);

        hash.beforeSend = function (xhr) {
          if (adapter.headers !== undefined) {
            var headers = adapter.headers;
            Ember['default'].keys(headers).forEach(function (key) {
              xhr.setRequestHeader(key, headers[key]);
            });
          }
        };

        hash.success = function (json, textStatus, jqXHR) {
          Ember['default'].run(null, resolve, json);
        };

        hash.error = function (jqXHR/*, textStatus, errorThrown*/) {
          Ember['default'].run(null, reject, adapter.ajaxError(jqXHR, function (hash) {
            console.error('ajax error');
            console.log(hash);
          }));
        };

        hash.url = url.toLowerCase();
        hash.crossDomain = true;

        // CORS: This enables cookies to be sent with the request
        hash.xhrFields = { withCredentials: true };

        Ember['default'].$.ajax(hash);
      }.bind(this), 'DS: AudienceAdapter#ajax ' + type + ' to ' + rawUrl);
    }

  });

});
define('web-desktop/adapters/employee', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/employee', 'ember'], function (exports, Adapter, Serializer, Ember) {

  'use strict';

  var isEmpty = Ember['default'].isEmpty;

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    find: function (store, type, id, record) {
      var url = this.buildURL();
      var requestStr = 'GET ON id=' + id;
      return this.ajax(url, 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'Employee'
      });
    }

  });

});
define('web-desktop/adapters/login', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/login'], function (exports, Adapter, Serializer) {

  'use strict';

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    createRecord: function (store, type, query) {
      var url = this.buildURL();
      return this.ajax(url, 'POST', {
        data: {requestString: 'login' + JSON.stringify(query)},
        serviceAppName: 'Login'
      });
    }

  });

});
define('web-desktop/adapters/logout', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/login'], function (exports, Adapter, Serializer) {

  'use strict';

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    createRecord: function (store, type, query) {
      var url = this.buildURL();
      return this.ajax(url, 'POST', {
        data: {requestString: 'logout'},
        serviceAppName: 'Login'
      });
    }

  });

});
define('web-desktop/adapters/user-company', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/user-company', 'ember'], function (exports, Adapter, Serializer, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    createRecord: function (store, type, record) {
      var id = get(record, 'company_id');
      var requestStr = id;
      return this.ajax(this.buildURL(), 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'SetCompany'
      });
    }

  });

});
define('web-desktop/adapters/user-setting', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/user-setting', 'ember'], function (exports, Adapter, Serializer, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    find: function (store, type, id) {
      // Get on id = 2 or id = 3
      var onStr = 'ON employee_id=' + id;
      var requestStr = 'GET ' + onStr;
      return this.ajax(this.buildURL(), 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'UserSetting'
      });
    },

    updateRecord: function (store, type, record) {
      var id = get(record, 'id');
      var installed_app = JSON.stringify(get(record, 'installed_app'));
      var requestStr = 'UPDATE installed_app=%@ ON employee_id=%@'.fmt(JSON.stringify(installed_app), id);
      return this.ajax(this.buildURL(), 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'UserSetting'
      });
  },

  });

});
define('web-desktop/adapters/user', ['exports', 'web-desktop/adapters/base', 'web-desktop/serializers/base', 'ember'], function (exports, Adapter, Serializer, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Adapter['default'].extend({
    serializer: Serializer['default'].create(),

    createRecord: function (store, type, record) {
      var url = this.buildURL();
      var requestStr = 'GetUser';
      var serviceAppName = 'Login';

      return this.ajax(url, 'POST', {
        data: {requestString: requestStr},
        serviceAppName: serviceAppName
      });
    }

  });

});
define('web-desktop/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'web-desktop/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('web-desktop/components/star-rating', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: 'span',
    classNames: ['star-rating'],
    stars: function () {
      var rating = this.get('content') || 0;
      var array = new Array(rating);
      return array;
    }.property('content')

  });

});
define('web-desktop/components/trash-can', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNameBindings: [':fadeIn-100ms', ':animated', 'show:fadeIn:fadeOut'],
    didInsertElement: function () {
      var self = this;
      this.$('.trash').droppable({
        hoverClass: "ui-state-hover",
        accept: ".appicon",
        drop: function (event, ui) {
          var id = Ember['default'].$(ui.draggable[0]).attr('id');
          var view = Ember['default'].View.views[id];
          if (view) {
            self.sendAction('action', view.get('content'));
          }
        }
      });
    }
  });

});
define('web-desktop/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    loginShow: false,
    appMoving: false,
    actions: {
      loginShow: function () {
        this.set('loginShow', true);
      },
      loginClose: function () {
        this.set('loginShow', false);
      }
    }
  });

});
define('web-desktop/controllers/applist-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    
  });

});
define('web-desktop/controllers/applist', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;
  var set = Ember['default'].set;
  var isEmpty = Ember['default'].isEmpty;

  exports['default'] = Ember['default'].Controller.extend({
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

    companyId: Ember['default'].computed.alias('controllers.application.current_login_company'),
    employeeId: Ember['default'].computed.alias('controllers.application.employee.id'),

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
      var employeeId = this.get('employeeId');
      var model = this.get('model');
      if (model) {
        model.clear();
      }
      this.store.unloadAll('user-setting');
      this.store.find('user-setting', employeeId).then(function (settings) {
        var obj = get(settings, '_data');
        var installApps = get(obj, 'installed_app');
        var hash = {};
        if (!isEmpty(installApps)) {
          installApps.forEach(function (item) {
            hash[get(item, 'id')] = item;
          });
          var ids = installApps.getEach('id');
          this.store.findQuery('app-info', {ids: ids}).then(function (res) {
            var apps = res.get('content');
            if (apps) {
              apps.forEach(function (app) {
                var obj = hash[parseInt(app.get('id'))];
                if (obj && obj.location) {
                  var array = obj.location.split(',');
                  app.setProperties({
                    'screen': parseInt(array[0]),
                    'row': parseInt(array[1]),
                    'col': parseInt(array[2]),
                    'linked': obj.link || []
                  });
                }
                model.pushObject(app);
              }.bind(this));
            }
          }.bind(this));
        }
      }.bind(this));
    }.observes('companyId'),

    syncAppLayout: function () {
      var array = [];
      this.get('model').forEach(function (item) {
        array.pushObject({
          id: get(item, 'id'),
          location: get(item, 'screen') + ',' + get(item, 'row') + ',' + get(item, 'col'),
          link: get(item, 'linked')
        });
      });

      var model = this.store.getById('user-setting', this.get('employeeId'));
      model.set('installed_app', array);
      if (this.get('companyId') !== 0) {
        model.save().then(function () {});
      }
    },

    actions: {
      appPosChange: function () {
        this.syncAppLayout();
      },
      appMoving: function () {
        this.set('controllers.application.appMoving', true);
      },
      appStop: function () {
        this.set('controllers.application.appMoving', false);
      },

      openApp: function (item) {
        var name = get(item, 'name');
        var icon = get(item, 'icon');
        var find = this.get('openApps').any(function (it) {
          return get(it, 'name') === name;
        });

        if (!find) {
          var viewName = get(item, 'viewName') || 'iframe';
          var klass = this.container.lookupFactory('view:' + viewName);
          var length = this.get('openApps').length;
          var top = 60 + 30 * length;
          var left = 135 + 30 * length;
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

        if (Ember['default'].isEmpty(obj)) {
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
          var zindex = parseInt(Ember['default'].$(instant.get('element')).css("z-index"));
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

        apps.pushObject(Ember['default'].$.extend({
          screen: screen,
          col: col,
          row: row
        }, content));

        this.syncAppLayout();
      },

      deleteApp: function (content) {
        this._actions['closeApp'].apply(this, [content]);
        this.get('model').removeObject(content);
        this.syncAppLayout();
      },


    }
  });

});
define('web-desktop/controllers/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ['applist', 'application'],
    openApps: Ember['default'].computed.alias('controllers.applist.openApps'),
    user: Ember['default'].computed.alias('controllers.application.user'),
    headerShowing: Ember['default'].computed.not('controllers.application.appMoving'),
    isLogin: Ember['default'].computed.alias('controllers.application.isLogin'),
    companies: Ember['default'].computed.alias('controllers.application.companies'),
    current_login_company: Ember['default'].computed.alias('controllers.application.current_login_company'),
    dock: function () {
      return this.get('openApps').slice(0, 10);
    }.property('openApps.length'),

    subDock: function () {
      return this.get('openApps').slice(11);
    }.property('openApps.length')

  });

});
define('web-desktop/controllers/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    resultDivHeight: 0,
    actions: {
      getSearchContent: function (query) {
        this.store.findQuery('app-info', {ids: []}).then(function (res) {
          var apps = res.get('content').map(function(u){return u._data;});
          var searchResults = [];
          if (apps) {
            searchResults = apps.filter(function (app) {
              return Ember['default'].get(app, 'name').toLowerCase().indexOf(query.toLowerCase()) >=0;
            });
          }
          this.set('searchContent', searchResults);
        }.bind(this));
      }
    }
  });

});
define('web-desktop/initializers/export-application-global', ['exports', 'ember', 'web-desktop/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('web-desktop/mixins/drag-n-drop-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Drag = Ember['default'].Namespace.create({});

  Drag.cancel = function (event) {
    event.preventDefault();
    return false;
  };

  Drag.Draggable = Ember['default'].Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function (evt) {
      /* firefox will only allow dragStart if it has data */
      evt.originalEvent.dataTransfer.setData('text/plain', 'DRAGGABLE');
    }
  });

  Drag.Droppable = Ember['default'].Mixin.create({
    placeholder: null,
    dragEnter: Drag.cancel,
  //  dragOver: Drag.cancel,
    drop: function (event) {
      event.preventDefault();
      return false;
    }
  });

  exports['default'] = Drag;

});
define('web-desktop/mixins/flipwindow-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    classNames: ['flipper'],

    linkAppObject: {},
    linkOriginApp: null,
    appLinkables: [],

    flipCallback: Ember['default'].K,
    unflipCallback: Ember['default'].K,
    actions: {
      flip: function () {
        this.$().addClass('fliped');
        this.flipCallback();
      },
      unflip: function () {
        this.$().removeClass('fliped');
        this.unflipCallback();
      }
    }

  });

});
define('web-desktop/mixins/window-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    classNames: ['window', 'windows-vis', 'flipper', 'fadeIn', 'fadeIn-20ms'],
    classNameBindings: ['active'],
    active: true,
    width: function () {
      return this.get('content.width') || 950;
    }.property('content.width'),

    height: function () {
      return this.get('content.height') || 600;
    }.property('content.height'),

    left: 0,
    top: 45,

    minWidth: 600,
    minHeight: 450,

    layoutName: 'window',
    isFullSize: false,
    isMinSize: false,

    changeZindex: function () {
      this.set('active', true);

      var zindex = -1;
      Ember['default'].$('.window').each(function (index, item) {
        var node = Ember['default'].$(item);
        var z = parseInt(node.css('z-index'));
        if (z > zindex) {
          zindex = z;
        }
        var view = Ember['default'].View.views[node.attr('id')];
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

      if (this.get('content.maximized') === 'true') {
        this._actions['maximizeApp'].apply(this);
      } else {
        this.$().css({
          width: this.get('width'),
          height: this.get('height'),
          left: this.get('left'),
          top: this.get('top')
        });
      }
      if (this.get('content.realizable')) {
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
        this.$('.header').on('dblclick', function () {
          this._actions['maximizeApp'].apply(this);
        }.bind(this));
      }

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

      this.$(window).resize(function() {
        Ember['default'].run.debounce(function () {
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
          if (this.$().css('top') === 'auto') {
            this.$().css('top', 47);
          }
          if (this.$().css('left') === 'auto') {
            this.$().css('left', 0);
          }
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
      }
    }

  });

});
define('web-desktop/models/app-info', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    owner: DS['default'].attr('string'),
    name: DS['default'].attr('string'),
    last_version: DS['default'].attr('string'),
    show_in_store: DS['default'].attr('boolean'),
    pricing_by_month: DS['default'].attr('number'),
    security_level: DS['default'].attr('string'),
    certified: DS['default'].attr('boolean'),
    default_install: DS['default'].attr('boolean'),
    subscribed_services: DS['default'].attr('string'),
    output_service: DS['default'].attr('string'),
    input_service: DS['default'].attr('string'),
    linked: DS['default'].attr('string'),
    censorship_date: DS['default'].attr('string'),
    path: DS['default'].attr('string'),
    icon: DS['default'].attr('string'),
    maximized: DS['default'].attr('boolean'),
    has_header: DS['default'].attr('boolean'),
    realizable: DS['default'].attr('boolean'),
    width: DS['default'].attr('number'),
    height: DS['default'].attr('number'),
    screen: DS['default'].attr('number', {defaultValue: 0}),
    row: DS['default'].attr('number', {defaultValue: 0}),
    col: DS['default'].attr('number', {defaultValue: 0})
  });

});
define('web-desktop/models/employee', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr('string'),
    user_id: DS['default'].attr('number'),
    first: DS['default'].attr('string'),
    last: DS['default'].attr('string'),
    email: DS['default'].attr('string'),
    type: DS['default'].attr('string'),
    from: DS['default'].attr('string'),
    report_to_id: DS['default'].attr('number'),
    installed_app: DS['default'].attr('string'),
    active: DS['default'].attr('boolean'),

    didLoad: function(){
      setInterval(function() {
        this.reload();
      }.bind(this), 10*1000); //every 10s
    }
  });

});
define('web-desktop/models/installed-app', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    link: DS['default'].attr('string'),
    location: DS['default'].attr('string')
  });

});
define('web-desktop/models/login', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    user_name: DS['default'].attr('string'),
    pwd: DS['default'].attr('string'),
    company_id: DS['default'].attr('number')
  });

});
define('web-desktop/models/logout', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr('string'),
  });

});
define('web-desktop/models/user-company', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    company_id: DS['default'].attr('number'),
  });

});
define('web-desktop/models/user-setting', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    user_id: DS['default'].attr('number'),
    employee_id: DS['default'].attr('number'),
    installed_app: DS['default'].attr()
  });

});
define('web-desktop/models/user', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].Model.extend({
	});

});
define('web-desktop/router', ['exports', 'ember', 'web-desktop/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function() {
    this.route('login');
  });

  Router.reopen({
    rootURL: '/'
  });

  exports['default'] = Router;

});
define('web-desktop/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;
  var isEmpty = Ember['default'].isEmpty;

  exports['default'] = Ember['default'].Route.extend({

    _setupUserInfo: function (user, employee_info, companies, current_login_company ) {
      var ctr = this.get('controller');
      if (isEmpty(user) && isEmpty(employee_info)) {
        ctr.setProperties({
          'isLogin': false
        });
      } else {
        ctr.setProperties({
          'isLogin': true
        });
      }
      ctr.setProperties({
        'user': user || {},
        'employee': employee_info || {id: 1},
        'current_login_company': current_login_company || 0,
        'companies': companies || []
      });
    },

    beforeModel: function (params) {
      this.set('appinstall', get(params, 'queryParams.appinstall'));
      this.store.createRecord('user', {}).save().then(function (res) {
        var obj = res._data;
        if (obj) {
          this._setupUserInfo(obj.user, obj.employee_info, obj.companies, obj.current_login_company);
        } else {
          this._setupUserInfo();
        }
      }.bind(this), function (err) {
        this._actions['SignOut'].apply(this);
      }.bind(this));
    },

    model: function (params) {
      return {
        applist:[]
      };
    },

    setupController: function (controller, model) {
      var ctl = this.controllerFor('applist');
      ctl.reset();
      ctl.set('model', get(model , 'applist'));
      ctl.set('appinstall', this.get('appinstall'));
      // try {
      //   user = JSON.parse(localStorage.getItem('gausian-user'));
      // } catch (e) {
      //   console.error(e);
      // }
      // console.log(user);
      // if (user && get(user, 'id')) {
      //   this.store.find('employee', get(user, 'id'));
      // }
    },

    renderTemplate: function() {
      this.render();
      this.render('applist', {
        outlet: 'applist',
        into: 'application'
      });
    },

    actions: {

      installApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['addApp'].apply(ctrl, arguments);
      },

      openApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['openApp'].apply(ctrl, arguments);
      },

      deleteApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['deleteApp'].apply(ctrl, arguments);
      },

      loginUser: function (content) {

        this.store.createRecord('login', {
          user_name: get(content, 'emailAddr'),
          pwd: get(content, 'password'),
          company_id: 1
        }).save().then(function (res) {
          var obj = res._data.response;
          var responseCode = res._data.response_code;
          console.log(obj);
          if (res._data.response_code !== 1) {
            this.get('controller').set('loginFail', true);
          } else {
            this._setupUserInfo(obj.user, obj.employee_info, obj.companies, obj.current_login_company);
            this.set('controller.loginShow', false);
          }
        }.bind(this));
      },

      loginVisitor: function (content) {
        var user = {
          first: get(content, 'firstName'),
          last: get(content, 'lastName'),
          emailAddr: get(content, 'emailAddr'),
          invCode: get(content, 'invCode'),
          loginType: 2,
          token: 'asdfasdfasdf'
        };
        this._setupUserInfo(user);

        // localStorage.setItem('gausian-user', JSON.stringify(user));
        this.set('controller.loginShow', false);
      },

      changeCompany: function (id) {
        this.store.createRecord('user-company', {'company_id': id}).save().then(function (res) {
        this._setupUserInfo(this.get('controller.user'), get(res, '_data.employee_info'), this.get('controller.companies'), id);

        }.bind(this));
      },

      SignOut: function () {
        this.store.createRecord('logout').save().then(function (res) {
          var responseBody = res._data.response;
          var responseCode = res._data.response_code;
          console.log(responseBody);
          this._setupUserInfo();
          // this.refresh();
        }.bind(this));
        // localStorage.setItem('gausian-user', null);
      }
    }
  });

});
define('web-desktop/serializers/app-info', ['exports', 'web-desktop/serializers/base'], function (exports, Base) {

	'use strict';

	exports['default'] = Base['default'].extend({});

});
define('web-desktop/serializers/base', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({
    extract: function (store, type, payload/*, id, requestType*/) {
      var response = Ember['default'].get(payload, 'response');
      var code = Ember['default'].get(payload, 'response_code');

      var obj = [];
      if (code === 1 && response) {
        try {
          obj = JSON.parse(response);
        } catch (e) {
          console.error('serializer - failed to parse response: ' +response);
        }
      }
      return obj;
    }
  });

});
define('web-desktop/serializers/employee', ['exports', 'web-desktop/serializers/base'], function (exports, Base) {

	'use strict';

	exports['default'] = Base['default'].extend({});

});
define('web-desktop/serializers/login', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({


    extract: function (store, type, payload/*, id, requestType*/) {
      var response = Ember['default'].get(payload, 'response');

      var obj = {};
      if (response) {
        obj = JSON.parse(response);
      }
      Ember['default'].set(payload, 'response', obj);
      return payload;
    }
    // serializeIntoHash: function (hash, type, record, options) {
    //   var oldHash = this.serialize(record, options);
    //   oldHash.seatId = parseInt(record.get('seatId.id'), 10);
    //   oldHash.id = parseInt(record.get('id'), 10);
    //
    //   Ember.merge(hash, oldHash);
    // }
  });

});
define('web-desktop/serializers/user-company', ['exports', 'web-desktop/serializers/base'], function (exports, Base) {

	'use strict';

	exports['default'] = Base['default'].extend({});

});
define('web-desktop/serializers/user-setting', ['exports', 'web-desktop/serializers/base', 'ember'], function (exports, Base, Ember) {

  'use strict';

  exports['default'] = Base['default'].extend({

    extract: function (store, type, payload/*, id, requestType*/) {
      var array = this._super(store, type, payload);
      var installed_app = [];
      var obj = array[0];
      try {
        var str = Ember['default'].get(obj, 'installed_app');
        if (str) {
          installed_app = JSON.parse(str);
          Ember['default'].set(obj, 'installed_app', installed_app);
        }
      } catch (e) {
        console.error(e);
      }
      return obj;
    }
  });

});
define('web-desktop/templates/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"effect\"></div>\r\n<div class=\"app-edge\"></div>\r\n<div class=\"app-img\"></div>\r\n<div class=\"app-text\">");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<!-- DESKTOP -->\r\n");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{
      'isVisible': ("controller.headerShowing")
    },hashTypes:{'isVisible': "ID"},hashContexts:{'isVisible': depth0},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "render", "header", options))));
    data.buffer.push("\r\n\r\n");
    data.buffer.push(escapeExpression((helper = helpers['trash-can'] || (depth0 && depth0['trash-can']),options={hash:{
      'action': ("deleteApp"),
      'show': ("controller.appMoving")
    },hashTypes:{'action': "STRING",'show': "ID"},hashContexts:{'action': depth0,'show': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "trash-can", options))));
    data.buffer.push("\r\n\r\n");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "searchBar", options) : helperMissing.call(depth0, "render", "searchBar", options))));
    data.buffer.push("\r\n\r\n");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "applist", options) : helperMissing.call(depth0, "outlet", "applist", options))));
    data.buffer.push("\r\n\r\n");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "login", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n\r\n<div id=\"ui_maskLayer_0\" class=\"ui_maskLayer\">\r\n  <div id=\"ui_maskLayerBody_0\" class=\"ui_maskLayerBody\"></div>\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/applist', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n  ");
    stack1 = helpers['if'].call(depth0, "hasApp", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n  ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\r\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appscreen", {hash:{
      'index': ("id"),
      'hasApp': ("hasApp")
    },hashTypes:{'index': "ID",'hasApp': "ID"},hashContexts:{'index': depth0,'hasApp': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n  ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\r\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appicon", {hash:{
      'content': ("app")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n    ");
    return buffer;
    }

    data.buffer.push("\r\n\r\n\r\n  ");
    stack1 = helpers.each.call(depth0, "view.controller.screens", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n\r\n  \r\n    ");
    stack1 = helpers.each.call(depth0, "app", "in", "view.controller.model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n  \r\n  <div class='hint'></div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\r\n");
    
  });

});
define('web-desktop/templates/components/star-rating', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\r\n  <i class=\"fa fa-star\"></i>\r\n");
    }

    stack1 = helpers.each.call(depth0, "stars", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/components/trash-can', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\r\n<div class=\"trash fadeIn fadeIn-50ms fadeIn-Delay-20ms fadeOut fadeOut-50ms\">DELETE</div>\r\n");
    
  });

});
define('web-desktop/templates/header-dock-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"app-img fadeIn fadeIn-50ms\" style=\"background-image: url(");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.icon", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(");\"></div>\r\n<em><span>");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("</span></em>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\r\n  <ul class=\"dropdown-menu-left\">\r\n    <li>\r\n      <a>Company Info</a>\r\n    </li>\r\n    <li>\r\n      <a>Create New Accounts</a>\r\n    </li>\r\n  </ul>\r\n  ");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n      <span>\r\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showProfile", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "user.first", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "user.last", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\r\n      </span>\r\n\r\n      ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\r\n      <span>\r\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "loginShow", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Sign up / Log in</a>\r\n        <img src=\"assets/img/GAUSIAN_logo.png\" >\r\n      </span>\r\n      ");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n  <ul class=\"dropdown-menu pull-right\">\r\n    <li>\r\n      <a>My Account</a>\r\n    </li>\r\n    ");
    stack1 = helpers.each.call(depth0, "companies", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n    <li>\r\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "SignOut", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Sign Out</a>\r\n    </li>\r\n  </ul>\r\n  ");
    return buffer;
    }
  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n    <li>\r\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeCompany", "id", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\r\n    </li>\r\n    ");
    return buffer;
    }

    data.buffer.push("<ul class=\"nav fadeIn fadeIn-50ms animated fadeIn\">\r\n  <li class=\"logo fadeIn fadeIn-50ms\">\r\n    <span>\r\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showProfile_comp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("> ");
    stack1 = helpers._triageMustache.call(depth0, "view.companyName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </a>\r\n    </span>\r\n  </li>\r\n  ");
    stack1 = helpers['if'].call(depth0, "view.showProfile_comp", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n\r\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "header-dock", {hash:{
      'content': ("dock")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n\r\n  <li class=\"login fadeIn fadeIn-50ms\">\r\n      ");
    stack1 = helpers['if'].call(depth0, "isLogin", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n  </li>\r\n  ");
    stack1 = helpers['if'].call(depth0, "view.showProfile", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n</ul>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/iframe', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<iframe ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.path")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("view.content.name")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\" frameBorder=\"0\"></iframe>\r\n<div id=\"iframeApp_dragResizeMask_3\" class=\"iframeDragResizeMask\"></div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/link-board', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n      <div class=\"back_app_unit\">\r\n        <img class=\"back_app_image\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\r\n        <div class=\"back_name\">");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>\r\n        ");
    stack1 = helpers['if'].call(depth0, "hasLinked", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n        ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\r\n        <div class=\"back_app_linked\">\r\n          <img class=\"back_app_linked_img\" src=\"assets/img/link_orange.png\"/>\r\n        </div>\r\n        <div class=\"back_app_overlay\" onclick=\"flipper.classList.toggle('flipped');\">\r\n          <a class=\"back_app_overlay_text\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "unlink", "", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">Unlink</a>\r\n        </div>\r\n        ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\r\n        <div class=\"back_app_overlay\" onclick=\"flipper.classList.toggle('flipped');\">\r\n          <a class=\"back_app_overlay_text\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "link", "", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">Link</a>\r\n        </div>\r\n        ");
    return buffer;
    }

    data.buffer.push("<div class=\"back_edge\">\r\n  <div class=\"back_content\">\r\n\r\n    <div class=\"back_shadow_decoration\"></div>\r\n    <div class=\"back_title\">Available Links on Desktop</div>\r\n    <div class=\"back_app_container\">\r\n      ");
    stack1 = helpers.each.call(depth0, "view.content", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n      </div>\r\n    </div>\r\n<!-- 						<div class=\"back_recommend\">Popular Links on Cloud</div>\r\n    <div class=\"back_recommend_container\">\r\n      <div class=\"back_app_unit\">\r\n        <img class=\"back_app_image2\" src=\"http://asa.static.gausian.com/user_app/Quotes/icon.png\"/>\r\n        <div class=\"back_name\">Quotes</div>\r\n        <div class=\"back_app_overlay\"></div>\r\n      </div>\r\n      <div class=\"back_app_unit\">\r\n        <img class=\"back_app_image2\" src=\"http://asa.static.gausian.com/user_app/HipChat/icon.png\"/>\r\n        <div class=\"back_name\">HipChat</div>\r\n        <div class=\"back_app_overlay\"></div>\r\n      </div>\r\n      <div class=\"back_app_unit\">\r\n        <img class=\"back_app_image2\" src=\"http://asa.static.gausian.com/user_app/Pixlr/icon.png\"/>\r\n        <div class=\"back_name\">Pixlr</div>\r\n        <div class=\"back_app_overlay\"></div>\r\n      </div>\r\n      <div class=\"back_app_unit\">\r\n        <img class=\"back_app_image2\" src=\"http://asa.static.gausian.com/user_app/Map/icon.png\"/>\r\n        <div class=\"back_name\">Map</div>\r\n        <div class=\"back_app_overlay\"></div>\r\n      </div>\r\n    </div> -->\r\n    <div class=\"back_notation\">Powered by GAUSIAN ASA</div>\r\n  </div>\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<i class=\"icon-remove modal-close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "loginClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("></i>\r\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":blur-image :animated loginShow:fadeIn")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></div>\r\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":flip-container :animated loginShow:bounceInDown:bounceOutUp")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\r\n  <div id=\"flipper\" class=\"\">\r\n    <div class=\"front\">\r\n      <div class=\"badge_band_right\"></div>\r\n      <div class=\"badge_band_left\"></div>\r\n      <div class=\"badge_band_left_shadow\"></div>\r\n      <div class=\"badge_band_end\"></div>\r\n      <a href=\"http://www.gausian.com\">\r\n        <div class=\"badge_buckle\">\r\n          <img class=\"logo_img\" src=\"assets/img/GAUSIAN_logo.png\">\r\n        </div>\r\n      </a>\r\n      <div class=\"badge_buckle_shadow\"></div>\r\n      <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":badge_container loginFail:has-error loginFail")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\r\n        <div class=\"up_container\">\r\n          <img class=\"up_img\" src=\"assets/img/einstein.png\" onclick=\"\r\n            flipper.classList.toggle('flipped');\r\n            document.getElementById('visitor_container').style.opacity=0;\r\n            document.getElementById('sign_container').style.opacity=0;\r\n            document.getElementById('portrait_container').style.opacity=1;\r\n            \">\r\n          <div id=\"up_hole\"></div>\r\n        </div>\r\n        <div class=\"down_container\">\r\n          <div class=\"company_name\"> Your Company Name </div>\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.emailAddr"),
      'class': ("email_input visitor_input"),
      'placeholder': ("Email")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("password"),
      'value': ("view.password"),
      'class': ("pw_input"),
      'placeholder': ("Password")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"login_bn\">Login</button>\r\n\r\n          <div class=\"sign_bn fadeIn fadeIn-100ms fadeIn-Delay-50ms\" onclick=\"\r\n            flipper.classList.toggle('flipped');\r\n            document.getElementById('visitor_container').style.opacity=0;\r\n            document.getElementById('sign_container').style.opacity=1;\r\n            document.getElementById('portrait_container').style.opacity=0;\r\n            \">\r\n            Sign up\r\n          </div>\r\n          <div class=\"visitor_bn fadeIn fadeIn-100ms fadeIn-Delay-50ms\" onclick=\"\r\n            flipper.classList.toggle('flipped');\r\n            document.getElementById('visitor_container').style.opacity=1;\r\n            document.getElementById('sign_container').style.opacity=0;\r\n            document.getElementById('portrait_container').style.opacity=0;\r\n            \">\r\n            I'm a Visitor\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"back\">\r\n      <div class=\"badge_band_right\"></div>\r\n      <div class=\"badge_band_left\"></div>\r\n      <div class=\"badge_band_left_shadow\"></div>\r\n      <div class=\"badge_band_end\"></div>\r\n      <div class=\"badge_buckle\"></div>\r\n      <div class=\"badge_buckle_back\"></div>\r\n      <div class=\"badge_buckle_shadow\"></div>\r\n      <div class=\"badge_container\">\r\n        <div class=\"up_container\">\r\n          <img class=\"up_img\" src=\"assets/img/empty.png\">\r\n          <div id=\"up_hole\"></div>\r\n        </div>\r\n        <img class=\"return_icon\" src=\"assets/img/return.png\" onclick=\"flipper.classList.toggle('flipped');\">\r\n        <div class=\"down_container\"></div>\r\n        <div id=\"sign_container\" style=\"opacity: 0;\">\r\n          <div class=\"back_container_header\">Sign up</div>\r\n          <input class=\"back_container_input_first\" type=\"text\" placeholder=\"First\">\r\n          <input class=\"back_container_input_last\" type=\"text\" placeholder=\"Last\">\r\n          <input class=\"back_container_input_email\" type=\"text\" placeholder=\"Email\">\r\n          <input class=\"back_container_input_company\" type=\"text\" placeholder=\"Full Company Name\">\r\n          <input class=\"back_container_input_pw\" type=\"password\" placeholder=\"Password\">\r\n          <a href=\"http://yubin.github.io/web_desktop\">\r\n            <div class=\"back_container_sign\">Sign</div>\r\n          </a>\r\n          <div class=\"back_container_invite\">Invite</div>\r\n        </div>\r\n        <div id=\"visitor_container\" style=\"opacity: 0;\">\r\n          <div class=\"back_container_header\">Visitor to</div>\r\n          <div class=\"visitor_input_company_name\">You Company Name</div>\r\n\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.firstName"),
      'class': ("visitor_input_first visitor_input"),
      'placeholder': ("First")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.lastName"),
      'class': ("visitor_input_last visitor_input"),
      'placeholder': ("Last")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.emailAddr"),
      'class': ("visitor_input_email visitor_input"),
      'placeholder': ("Email")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.invCode"),
      'class': ("visitor_input_security visitor_input"),
      'placeholder': ("Invitation Code")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n          <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "visitor", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"back_container_enter\">Enter</button>\r\n        </div>\r\n        <div id=\"portrait_container\" style=\"opacity: 1;\">\r\n          <div class=\"back_container_header\">Change Portrait</div>\r\n          <div class=\"portrait_container\">\r\n            <img class=\"portrait_img\" src=\"assets/img/einstein_5.png\">\r\n          </div>\r\n          <input class=\"portrait_email\" type=\"text\" placeholder=\"Email\">\r\n          <input class=\"portrait_pw\" type=\"password\" placeholder=\"Password\">\r\n          <div class=\"portrait_apply\">Apply New Portrait</div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/scroll-bar-handler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"jspDrag\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.style")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\r\n  <div class=\"jspDragTop\"></div>\r\n  <div class=\"jspDragBottom\"></div>\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/scroll-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"jspCap jspCapTop\"></div>\r\n<div class=\"jspTrack\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.trackStyle")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\r\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar-handler", {hash:{
      'len': ("view.handlerLen"),
      'top': ("view.handlerTop")
    },hashTypes:{'len': "ID",'top': "ID"},hashContexts:{'len': depth0,'top': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n</div>\r\n<div class=\"jspCap jspCapBottom\"></div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"search fadeIn fadeIn-50ms fadeIn-Delay-20ms\">\r\n  <div class=\"search-icon\"></div>\r\n  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Search APP or Content"),
      'disabled': (true)
    },hashTypes:{'type': "STRING",'placeholder': "STRING",'disabled': "BOOLEAN"},hashContexts:{'type': depth0,'placeholder': depth0,'disabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n</div>\r\n\r\n<div class=\"overlay\">\r\n  <div class=\"modal fadeIn fadeIn-50ms\">\r\n    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.query")
    },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\r\n    <a class=\"cancel_search\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Cancel</a>\r\n    <div class=\"container\">\r\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "search-results", {hash:{
      'content': ("view.controller.searchContent")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n\r\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar", {hash:{
      'trackLen': ("view.trackLen"),
      'handlerLen': ("view.handlerLen"),
      'handlerTop': ("view.handlerTop")
    },hashTypes:{'trackLen': "ID",'handlerLen': "ID",'handlerTop': "ID"},hashContexts:{'trackLen': depth0,'handlerLen': depth0,'handlerTop': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n    </div>\r\n  </div>\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/search-results-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n<a class=\"action open\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "openApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\r\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n</a>\r\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\r\n<a class=\"action get\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "installApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\r\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n</a>\r\n");
    return buffer;
    }

    data.buffer.push("<div class=\"icon\">\r\n  <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" />\r\n</div>\r\n<div class=\"detail\">\r\n  <a class=\"name\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\r\n  <a class=\"star-rating\"> ");
    data.buffer.push(escapeExpression((helper = helpers['star-rating'] || (depth0 && depth0['star-rating']),options={hash:{
      'content': ("view.content.rating")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "star-rating", options))));
    data.buffer.push(" </a>\r\n  <a class=\"category\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.brief", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\r\n  <a class=\"price\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.catalog", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\r\n</div>\r\n");
    stack1 = helpers['if'].call(depth0, "view.content.installed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n");
    return buffer;
    
  });

});
define('web-desktop/templates/window', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"front shadow\">\r\n  <div class=\"header\">\r\n    <span class=\"titleInside\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\r\n  </div>\r\n  <nav class=\"control-window\">\r\n    <a href=\"#\" class=\"minimize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "minimizeApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">minimize</a>\r\n    <a href=\"#\" class=\"maximize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "maximizeApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">maximize</a>\r\n    <a href=\"#\" class=\"close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeApp", "view.content", {hash:{
      'target': ("view.parentView")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">close</a>\r\n  </nav>\r\n  <div class=\"container\">\r\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\r\n  </div>\r\n</div>\r\n<div class=\"back shadow\">\r\n  <img\r\n    class=\"return_icon\"\r\n    src=\"assets/img/return.png\"\r\n    ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "unflip", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n  />\r\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "link-board", {hash:{
      'content': ("view.appLinkables")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\r\n</div>\r\n");
    return buffer;
    
  });

});
define('web-desktop/tests/adapters/app-info.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/app-info.js should pass jshint', function() { 
    ok(true, 'adapters/app-info.js should pass jshint.'); 
  });

});
define('web-desktop/tests/adapters/base.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/base.js should pass jshint', function() { 
    ok(false, 'adapters/base.js should pass jshint.\nadapters/base.js: line 34, col 50, \'jqXHR\' is defined but never used.\nadapters/base.js: line 34, col 38, \'textStatus\' is defined but never used.\n\n2 errors'); 
  });

});
define('web-desktop/tests/adapters/employee.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/employee.js should pass jshint', function() { 
    ok(false, 'adapters/employee.js should pass jshint.\nadapters/employee.js: line 5, col 5, \'isEmpty\' is defined but never used.\nadapters/employee.js: line 10, col 36, \'record\' is defined but never used.\n\n2 errors'); 
  });

});
define('web-desktop/tests/adapters/login.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/login.js should pass jshint', function() { 
    ok(true, 'adapters/login.js should pass jshint.'); 
  });

});
define('web-desktop/tests/adapters/logout.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/logout.js should pass jshint', function() { 
    ok(false, 'adapters/logout.js should pass jshint.\nadapters/logout.js: line 7, col 40, \'query\' is defined but never used.\nadapters/logout.js: line 7, col 34, \'type\' is defined but never used.\nadapters/logout.js: line 7, col 27, \'store\' is defined but never used.\n\n3 errors'); 
  });

});
define('web-desktop/tests/adapters/user-company.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/user-company.js should pass jshint', function() { 
    ok(true, 'adapters/user-company.js should pass jshint.'); 
  });

});
define('web-desktop/tests/adapters/user-setting.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/user-setting.js should pass jshint', function() { 
    ok(true, 'adapters/user-setting.js should pass jshint.'); 
  });

});
define('web-desktop/tests/adapters/user.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/user.js should pass jshint', function() { 
    ok(false, 'adapters/user.js should pass jshint.\nadapters/user.js: line 5, col 5, \'get\' is defined but never used.\nadapters/user.js: line 10, col 40, \'record\' is defined but never used.\nadapters/user.js: line 10, col 34, \'type\' is defined but never used.\nadapters/user.js: line 10, col 27, \'store\' is defined but never used.\n\n4 errors'); 
  });

});
define('web-desktop/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('web-desktop/tests/components/star-rating.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/star-rating.js should pass jshint', function() { 
    ok(true, 'components/star-rating.js should pass jshint.'); 
  });

});
define('web-desktop/tests/components/trash-can.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/trash-can.js should pass jshint', function() { 
    ok(true, 'components/trash-can.js should pass jshint.'); 
  });

});
define('web-desktop/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('web-desktop/tests/controllers/applist-item.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/applist-item.js should pass jshint', function() { 
    ok(true, 'controllers/applist-item.js should pass jshint.'); 
  });

});
define('web-desktop/tests/controllers/applist.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/applist.js should pass jshint', function() { 
    ok(true, 'controllers/applist.js should pass jshint.'); 
  });

});
define('web-desktop/tests/controllers/header.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/header.js should pass jshint', function() { 
    ok(true, 'controllers/header.js should pass jshint.'); 
  });

});
define('web-desktop/tests/controllers/search-bar.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/search-bar.js should pass jshint', function() { 
    ok(true, 'controllers/search-bar.js should pass jshint.'); 
  });

});
define('web-desktop/tests/helpers/resolver', ['exports', 'ember/resolver', 'web-desktop/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('web-desktop/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('web-desktop/tests/helpers/start-app', ['exports', 'ember', 'web-desktop/app', 'web-desktop/router', 'web-desktop/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';

  function startApp(attrs) {
    var App;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Router['default'].reopen({
      location: 'none'
    });

    Ember['default'].run(function() {
      App = Application['default'].create(attributes);
      App.setupForTesting();
      App.injectTestHelpers();
    });

    App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

    return App;
  }
  exports['default'] = startApp;

});
define('web-desktop/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('web-desktop/tests/mixins/drag-n-drop-view.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/drag-n-drop-view.js should pass jshint', function() { 
    ok(true, 'mixins/drag-n-drop-view.js should pass jshint.'); 
  });

});
define('web-desktop/tests/mixins/flipwindow-view.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/flipwindow-view.js should pass jshint', function() { 
    ok(true, 'mixins/flipwindow-view.js should pass jshint.'); 
  });

});
define('web-desktop/tests/mixins/window-view.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/window-view.js should pass jshint', function() { 
    ok(true, 'mixins/window-view.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/app-info.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/app-info.js should pass jshint', function() { 
    ok(true, 'models/app-info.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/employee.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/employee.js should pass jshint', function() { 
    ok(true, 'models/employee.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/installed-app.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/installed-app.js should pass jshint', function() { 
    ok(true, 'models/installed-app.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/login.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/login.js should pass jshint', function() { 
    ok(true, 'models/login.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/logout.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/logout.js should pass jshint', function() { 
    ok(true, 'models/logout.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/user-company.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user-company.js should pass jshint', function() { 
    ok(true, 'models/user-company.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/user-setting.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user-setting.js should pass jshint', function() { 
    ok(true, 'models/user-setting.js should pass jshint.'); 
  });

});
define('web-desktop/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('web-desktop/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('web-desktop/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 36, col 29, \'err\' is defined but never used.\nroutes/application.js: line 41, col 20, \'params\' is defined but never used.\nroutes/application.js: line 73, col 27, \'content\' is defined but never used.\nroutes/application.js: line 78, col 24, \'content\' is defined but never used.\nroutes/application.js: line 83, col 26, \'content\' is defined but never used.\nroutes/application.js: line 96, col 13, \'responseCode\' is defined but never used.\nroutes/application.js: line 132, col 13, \'responseCode\' is defined but never used.\n\n7 errors'); 
  });

});
define('web-desktop/tests/serializers/app-info.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/app-info.js should pass jshint', function() { 
    ok(true, 'serializers/app-info.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/base.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/base.js should pass jshint', function() { 
    ok(true, 'serializers/base.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/employee.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/employee.js should pass jshint', function() { 
    ok(true, 'serializers/employee.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/login.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/login.js should pass jshint', function() { 
    ok(true, 'serializers/login.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/user-company.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/user-company.js should pass jshint', function() { 
    ok(true, 'serializers/user-company.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/user-setting.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/user-setting.js should pass jshint', function() { 
    ok(true, 'serializers/user-setting.js should pass jshint.'); 
  });

});
define('web-desktop/tests/test-helper', ['web-desktop/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

  'use strict';

  ember_qunit.setResolver(resolver['default']);

  document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

  QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
  var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
  document.getElementById('ember-testing-container').style.visibility = containerVisibility;

});
define('web-desktop/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('web-desktop/tests/utils/keys.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/keys.js should pass jshint', function() { 
    ok(true, 'utils/keys.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/appicon.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/appicon.js should pass jshint', function() { 
    ok(true, 'views/appicon.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/application.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/application.js should pass jshint', function() { 
    ok(true, 'views/application.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/applist.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/applist.js should pass jshint', function() { 
    ok(false, 'views/applist.js should pass jshint.\nviews/applist.js: line 136, col 33, Expected \'===\' and instead saw \'==\'.\nviews/applist.js: line 137, col 26, Expected \'===\' and instead saw \'==\'.\nviews/applist.js: line 138, col 26, Expected \'===\' and instead saw \'==\'.\nviews/applist.js: line 69, col 73, \'$\' is not defined.\nviews/applist.js: line 70, col 73, \'$\' is not defined.\n\n5 errors'); 
  });

});
define('web-desktop/tests/views/appscreen.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/appscreen.js should pass jshint', function() { 
    ok(false, 'views/appscreen.js should pass jshint.\nviews/appscreen.js: line 3, col 5, \'get\' is defined but never used.\n\n1 error'); 
  });

});
define('web-desktop/tests/views/header-dock-item.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/header-dock-item.js should pass jshint', function() { 
    ok(true, 'views/header-dock-item.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/header-dock.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/header-dock.js should pass jshint', function() { 
    ok(true, 'views/header-dock.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/header.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/header.js should pass jshint', function() { 
    ok(false, 'views/header.js should pass jshint.\nviews/header.js: line 66, col 24, \'id\' is defined but never used.\n\n1 error'); 
  });

});
define('web-desktop/tests/views/iframe.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/iframe.js should pass jshint', function() { 
    ok(false, 'views/iframe.js should pass jshint.\nviews/iframe.js: line 6, col 5, \'set\' is defined but never used.\n\n1 error'); 
  });

});
define('web-desktop/tests/views/link-board.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/link-board.js should pass jshint', function() { 
    ok(true, 'views/link-board.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/login.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/login.js should pass jshint', function() { 
    ok(true, 'views/login.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/scroll-bar-handler.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/scroll-bar-handler.js should pass jshint', function() { 
    ok(true, 'views/scroll-bar-handler.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/scroll-bar.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/scroll-bar.js should pass jshint', function() { 
    ok(true, 'views/scroll-bar.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/search-bar.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/search-bar.js should pass jshint', function() { 
    ok(false, 'views/search-bar.js should pass jshint.\nviews/search-bar.js: line 3, col 5, \'get\' is defined but never used.\n\n1 error'); 
  });

});
define('web-desktop/tests/views/search-results-item.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/search-results-item.js should pass jshint', function() { 
    ok(true, 'views/search-results-item.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/search-results.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/search-results.js should pass jshint', function() { 
    ok(false, 'views/search-results.js should pass jshint.\nviews/search-results.js: line 7, col 40, \'key\' is defined but never used.\nviews/search-results.js: line 7, col 35, \'obj\' is defined but never used.\n\n2 errors'); 
  });

});
define('web-desktop/utils/keys', ['exports'], function (exports) {

  'use strict';

  /**
  * Created by Jordan Hawker (hawkerj)
  * Date: 9/9/2014
  */

  var keyUtils = {
    KEYS: {
      BACKSPACE: 8,
      TAB: 9,
      ENTER: 13,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAUSE: 19,
      CAPS_LOCK: 20,
      ESCAPE: 27,
      UNIT_SEPARATOR: 31, // non-printable character
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      INSERT: 45,
      DELETE: 46,
      KEY_0: 48,
      KEY_1: 49,
      KEY_2: 50,
      KEY_3: 51,
      KEY_4: 52,
      KEY_5: 53,
      KEY_6: 54,
      KEY_7: 55,
      KEY_8: 56,
      KEY_9: 57,
      KEY_A: 65,
      KEY_B: 66,
      KEY_C: 67,
      KEY_D: 68,
      KEY_E: 69,
      KEY_F: 70,
      KEY_G: 71,
      KEY_H: 72,
      KEY_I: 73,
      KEY_J: 74,
      KEY_K: 75,
      KEY_L: 76,
      KEY_M: 77,
      KEY_N: 78,
      KEY_O: 79,
      KEY_P: 80,
      KEY_Q: 81,
      KEY_R: 82,
      KEY_S: 83,
      KEY_T: 84,
      KEY_U: 85,
      KEY_V: 86,
      KEY_W: 87,
      KEY_X: 88,
      KEY_Y: 89,
      KEY_Z: 90,
      LEFT_META: 91,
      RIGHT_META: 92,
      SELECT: 93,
      NUMPAD_0: 96,
      NUMPAD_1: 97,
      NUMPAD_2: 98,
      NUMPAD_3: 99,
      NUMPAD_4: 100,
      NUMPAD_5: 101,
      NUMPAD_6: 102,
      NUMPAD_7: 103,
      NUMPAD_8: 104,
      NUMPAD_9: 105,
      MULTIPLY: 106,
      ADD: 107,
      SUBTRACT: 109,
      DECIMAL: 110,
      DIVIDE: 111,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NUM_LOCK: 144,
      SCROLL_LOCK: 145,
      SEMICOLON: 186,
      EQUALS: 187,
      COMMA: 188,
      DASH: 189,
      PERIOD: 190,
      FORWARD_SLASH: 191,
      GRAVE_ACCENT: 192,
      OPEN_BRACKET: 219,
      BACK_SLASH: 220,
      CLOSE_BRACKET: 221,
      SINGLE_QUOTE: 222
    },

    isNumberKey: function (keyCode) {
      return (keyCode > 47 && keyCode < 58); // Number keys
    }
  };

  if (Object.freeze) {
    Object.freeze(keyUtils.KEYS);
  }

  exports['default'] = keyUtils;

});
define('web-desktop/views/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'appicon',
    classNames: ['appicon', 'fadeIn', 'fadeIn-50ms', 'fadeIn-Delay-100ms'],
    attributeBindings : [ 'draggable' ],
    // draggable         : 'true',
    row: function () {
      return this.get('content.row');
    }.property('content.row'),

    col: function () {
      return this.get('content.col');
    }.property('content.col'),

    scr: function () {
      return this.get('content.screen');
    }.property('content.screen'),

    iconWidth: function () {
      return this.get('parentView.iconWidth');
    }.property('parentView.iconWidth'),

    parentWidth: function () {
      return this.get('parentView.screenWidth');
    }.property('parentView.screenWidth'),

    parentHeight: function () {
      return this.get('parentView.screenHeight');
    }.property('parentView.screenHeight'),

    onIconSizeChange: function () {
      this.handleSize();
      this.position();
    }.observes('iconWidth', 'parentWidth','parentHeight'),

    didInsertElement: function () {
      this.$().draggable({
        scroll: false,
        containment: 'body',
        start: function(evt) {
          this.$().addClass('dragging');
          this.get('parentView').onDragStart(this, evt);
        }.bind(this),
        stop: function (evt) {
          Ember['default'].run.later(function () {
            var node = this.$();
            if (node) {
              node.removeClass('dragging');
              this.get('parentView').onDragStop(this, evt);
            }
          }.bind(this), 100);
        }.bind(this),
        drag: function (evt) {
          this.get('parentView').onDraging(this, evt);
        }.bind(this)

      });
      this.handleSize();
      this.position();
    },

    willDestroyElement: function () {
      this.get('parentView').onDragStop(null);
    },

    handleSize: function () {
      var iconWidth = this.get('iconWidth');

      this.$('span').css({
        'top': iconWidth + 5 * iconWidth / 60,
        'font-size': 12 + Math.round(iconWidth / 60)
      });

      this.$().css({
        'height': iconWidth,
        'width':  iconWidth,
        'display': 'inline-block',
        'float': 'left'
      });
      this.$('.app-img').css({
        'background': 'url(' + this.get('content.icon') + ') no-repeat',
        "background-size": "100%"
      });
    },

    index2position: function (row, col, scr) {
      var iconWidth = this.get('iconWidth');
      var iconHeight = this.get('iconWidth') * 1.3;

      var screenWidth = this.get('parentView.screenWidth');
      var screenHeight = this.get('parentView.screenHeight');

      var offsetWidth  = (screenWidth - iconWidth * 4) / 5;
      var offsetHeight = (screenHeight - iconHeight * 5) / 6;

      var widthOffset = this.get('parentView.widthOffset');
      var screenLeft = scr * (screenWidth + widthOffset) + widthOffset;

      return {
        top: (iconHeight + offsetHeight) * row + offsetHeight,
        left: (iconWidth + offsetWidth) * col + offsetWidth + screenLeft
      };
    },

    position: function (row, col, scr, duration) {
      if (Ember['default'].isEmpty(row) && Ember['default'].isEmpty(col) && Ember['default'].isEmpty(scr)) { // init
        row = this.get('row');
        col = this.get('col');
        scr = this.get('scr');
      } else { //
        this.get('controller').send('appPosChange', this.get('content'));
      }

      var position = this.index2position(row, col, scr);
      var top = position.top;
      var left = position.left;

      if (duration) {
        this.$().animate({
          'top': top,
          'left': left
        }, duration);
      } else {
        this.$().css({
          'top': top,
          'left': left
        });
      }
      this.setProperties({
        'content.row': row,
        'content.col': col,
        'content.screen': scr
      });
    },

    position2index: function (left, top) {
      var iconWidth = this.get('iconWidth');
      var iconHeight = this.get('iconWidth') * 1.3;
      var screenWidth = this.get('parentView.screenWidth');
      var screenHeight = this.get('parentView.screenHeight');

      var widthOffset = this.get('parentView.widthOffset');

      var screenLeft = screenWidth + widthOffset;

      var newScr = 0;
      for (var i = 0 ; i < 3; i++) {
        if (left + iconWidth/2 >= screenLeft * i + widthOffset && left + iconWidth/2 < screenLeft * (i + 1) + widthOffset) {
          newScr = i;
        }
      }

      var newCol = Math.floor((left + iconWidth/2 - newScr * screenLeft - widthOffset) * 4 / screenWidth);
      var newRow = Math.floor((top + iconHeight/2) * 5 / screenHeight);

      newCol = newCol < 0 ? 0: newCol;
      newCol = newCol > 3 ? 3: newCol;
      newRow = newRow > 4 ? 4: newRow;
      return {row: newRow, col: newCol, scr: newScr};
    },

    click: function () {
      var dragging = this.$().hasClass('dragging');
      if (!dragging) {
        this.get('controller').send('openApp', this.get('content'));
      }
    }

  });

});
define('web-desktop/views/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['application']
  });

});
define('web-desktop/views/applist', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    templateName: 'applist',
    classNames: ['applist'],

    height: 600,
    width: 400,

    left: 89,
    top: 103,

    deleting: 0,

    init: function () {
      this._super();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    didInsertElement: function () {
      this.handleSize();
    },

    handleSize: function () {

      var minWidthIcon = 48;
      // var minHeightWin = 600;
      // var minWidthWin = 800;
      var winWidth  = Ember['default'].$(window).width() ;
      var winHeight = Ember['default'].$(window).height();

      var paddingRate = 0.04;
      var paddingTop = winHeight * paddingRate;

      var top = Ember['default'].$('.ember-view.head').height() +
        Ember['default'].$('.ember-view.search-bar .search').height() + 2 * paddingTop;
      var node = this.$();
      if (node) {
        this.$().css({
          top: top,
          bottom: 0,
          left: 0,
          right: 0
        });
      }
      var height = (winHeight - top) * (1 - 2 * paddingRate);
      var width = winWidth / 3 * 0.86 ;
      var widthOffset = (winWidth - 3 * (width)) / 4;
      var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
      var iconHeight = iconWidth * 4 / 3;


      this.setProperties({
        screenWidth:  width,
        screenHeight: height,
        widthOffset:  widthOffset,
        iconWidth:    iconWidth,
        iconHeight:   iconHeight
      });
    },

    onDragStart: function (node, evt) {
      var originEvt = evt.originalEvent;
      var offset = node.$().parent().offset();
      var offsetX = originEvt.offsetX ? originEvt.offsetX : evt.clientX - $(evt.target).offset().left;
      var offsetY = originEvt.offsetY ? originEvt.offsetY : evt.clientY - $(evt.target).offset().top;
      var x = originEvt.clientX - offsetX - offset.left;
      var y = originEvt.clientY - offsetY - offset.top;
      this.setProperties({
        'activeApp': node,
        'offsetX': offsetX,
        'offsetY': offsetY
      });
      this.$('.hint').css({ // image follow
        'top': y,
        'left': x,
        'z-index': 99
      });
      this.$('.hint').show();
    },
    //
    onDraging: function (node, event) {
      this.get('controller').send('appMoving');
      var originEvt = event.originalEvent;
      var offset = node.$().parent().offset(); // TBD
      var x = originEvt.clientX - this.get('offsetX') - offset.left;
      var y = originEvt.clientY - this.get('offsetY') - offset.top;
      node.$().css({ // image follow
        'z-index': '100'
      });
      Ember['default'].run.debounce(function () {
        var rowCol = node.position2index(x, y);
        var row = rowCol.row;
        var col = rowCol.col;
        var scr = rowCol.scr;

        if (row >= 0){
          var position = node.index2position(row, col, scr);
          this.$('.hint').css({ // image follow
            'top': position.top,
            'left': position.left,
            'z-index': 99
          });

          if (node.get('row') !== row ||
              node.get('col') !== col ||
              node.get('scr') !== scr) {
            this.shuffle({
              row: node.get('row'),
              col: node.get('col'),
              scr: node.get('scr')
            }, rowCol);
          }
        }
      }.bind(this), 100);

    },
    onDragStop: function (node) {
      if (node) {
        node.position(node.get('row'), node.get('col'), node.get('scr'), 100);
        node.$().css({
          'z-index': 1
        });
      }
      this.$('.hint').hide();
      this.get('controller').send('appStop');
    },

    shuffle: function (from, to) {  // TBD add screen constrain
      console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
      var isSamePosition = function (pos1, pos2) {
        return get(pos1, 'col') == get(pos2, 'col') &&
        get(pos1, 'row') == get(pos2, 'row') &&
        get(pos1, 'scr') == get(pos2, 'scr');
      };
      var itemTarget = this.get('childViews').find(function (itemView) {
        return isSamePosition(itemView, to);
      });
      var itemOrigin = this.get('childViews').find(function (itemView) {
        return isSamePosition(itemView, from);
      });

      if (itemTarget) {
        itemTarget.position(get(from, 'row'), get(from, 'col'), get(from, 'scr'), 200);
      }
      if (itemOrigin) {
        itemOrigin.setProperties({
          'content.col': get(to, 'col'),
          'content.row': get(to, 'row'),
          'content.screen': get(to, 'scr')
        });
      }
    }
  });

});
define('web-desktop/views/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    // templateName: 'appscreen',
    classNames: ['appscreen', 'appscreen-set', 'dropzone'],
    classNameBindings: ['appTouch:background', 'hasApp', ':fadeIn-50ms', ':animated', 'hasApp:fadeIn:fadeOut'],
    appTouch: false,
    hasApp: false,

    init: function () {
      this._super();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    didInsertElement: function () {
      this.handleSize();
    },

    willDestroyElement: function() {
      var clone = this.$().clone();
      this.$().parent().append(clone);
      clone.fadeOut();
    },

    handleSize: function () {
      var node = this.$();
      var index = this.get('index') || 0;
      var width = this.get('parentView.screenWidth');
      var widthOffset = this.get('parentView.widthOffset');
      var left = index * (width + widthOffset) + widthOffset;
      if (node) {
        this.$().css({
          top: 0,
          left: left,
          width: width,
          height: this.get('parentView.screenHeight')
        });
      }
    }.observes('parentView.screenWidth',
      'parentView.screenHeight',
      'parentView.screenTop',
      'parentView.widthOffset')

  });

});
define('web-desktop/views/header-dock-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'header-dock-item',
    click: function () {
      this.get('content.instant').showMinimizedApp();
      this.get('content.instant').changeZindex();
    }
  });

});
define('web-desktop/views/header-dock', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].CollectionView.extend({
    tagName: 'ul',
    classNames: ['dock'],
    itemViewClass: 'header-dock-item'
  });

});
define('web-desktop/views/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['head'],
    classNameBindings: [':fadeIn-100ms', ':animated', 'show:fadeIn:fadeOut'],
    templateName: 'header',
    width_dock_icon: 52,
    width_dock_corner: 25,
    width_sync: 0,
    showProfile: false,
    showProfile_comp: false,
    show: Ember['default'].computed.alias('controller.headerShowing'),
    companyName: function () {
      var name = 'Company Name';
      var companies = this.get('controller.companies');
      var id = this.get('controller.current_login_company');
      if (!Ember['default'].isEmpty(companies) && id) {
        var obj = companies.findBy('id', parseInt(id));
        name = obj && Ember['default'].get(obj, 'name');
      }
      return name;
    }.property('controller.companies.[]', 'controller.current_login_company'),

    adjustSize: function () {
      var total_dock = this.get('content.dock.length');
      var offset = total_dock ? total_dock * this.get('width_dock_icon') + 2 * this.get('width_dock_corner') : 0;
      var width = (Ember['default'].$( window ).width() - offset - this.get('width_sync')) /2 ;
      if (this.get('_state') === "inDOM") {
        this.$('.left').width(width);
        this.$('.right').width(width);
      }
    }.observes('content.dock.length'),

    init: function() {
      this._super();
      Ember['default'].$(window).bind('resize', function () {
        this.adjustSize();
      }.bind(this));
      Ember['default'].$(document).on('click.' + this.elementId, Ember['default'].run.bind(this, function (event) {
        if(this.get('showProfile') || this.get('showProfile_comp')) {
          var $target = Ember['default'].$(event.target);
          if(this.$().find($target).length === 0) {
            this.set('showProfile', false);
            this.set('showProfile_comp', false);
          }
        }
      }));
    },
    didInsertElement: function () {
      this.adjustSize();
    },
    willDestroyElement: function() {
  		Ember['default'].$(document).off('click.' + this.elementId);
  	},
    actions: {
      showProfile: function () {
        this.toggleProperty('showProfile');
      },
      showProfile_comp: function () {
        this.toggleProperty('showProfile_comp');
      },
      changeCompany: function (id) {
        this.get('controller').send('changeCompany', id);
        this.toggleProperty('showProfile');
      },
      SignOut: function (id) {
        this.get('controller').send('SignOut');
        this.toggleProperty('showProfile');
      }
    }

  });

});
define('web-desktop/views/iframe', ['exports', 'ember', 'web-desktop/mixins/window-view', 'web-desktop/mixins/flipwindow-view'], function (exports, Ember, WindowMixin, FlipWindowMixin) {

  'use strict';

  var get = Ember['default'].get;
  var set = Ember['default'].get;
  var arraysEqual = function (a, b) {
    if (a === b) {
      return true;
    } else if ( a === null || b === null || a.length !== b.length) {
      return false;
    } else {
      a.forEach(function (item) {
        if (b.indexOf(item) < 0) {
          return false;
        }
      });
      return true;
    }
  };

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], FlipWindowMixin['default'], {
    classNameBindings: ['content.name'],
    templateName: 'iframe',

    appLinkables: [],

    changeAppLinkables: function () {
      var app = this.get('content');
      var output_service = get(app, 'output_service') || '';
      var idArray = output_service && output_service.split(',');
      var linked = get(app, 'linked');
      var appLinkables = this.get('appLinkables');
      appLinkables.clear();
      this.get('parentView.model').forEach(function (item) {
        var input_service = get(item, 'input_service');
        var id = get(item, 'id');
        if (id !== get(app, 'id') && idArray.indexOf(input_service) > -1) { // in white list
          var hasLinked = false;
          if (linked && linked.indexOf(id) > -1) { // linked
            hasLinked = true;
          }
          appLinkables.pushObject(Ember['default'].Object.create({
            id: get(item, 'id'),
            name: get(item, 'name'),
            icon: get(item, 'icon'),
            hasLinked: hasLinked
          }));
        }
      });
      this.$('iframe').load(function () {
        this.pushToIframe();
      }.bind(this));
    }.observes('content.input_service').on('didInsertElement'),

    pushToIframe: function () {
      var linkedApps = this.get('appLinkables').filterBy('hasLinked', true);
      var payload = {
        op: 'selectLink',
        targetApp: linkedApps
      };
      var url = this.$('iframe').attr('src');
      this.$('iframe')[0].contentWindow.postMessage(payload, url);
    },

    getLinkIds: function () {
      var linkedApps = this.get('appLinkables').filterBy('hasLinked', true);
      return linkedApps.mapBy('id');
    },

    unflipCallback: function () {
      var origin = this.get('content.linked');
      var ids = this.getLinkIds();

      if (!arraysEqual(origin, ids)) {
        this.set('content.linked', ids);
        this.get('parentView').syncAppLayout();
        this.pushToIframe();
      }
    }

  });

});
define('web-desktop/views/link-board', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'link-board',

    actions: {
      link: function (content) {
        content.set('hasLinked', true);
      },

      unlink: function (content) {
        content.set('hasLinked', false);
      }
    }

  });

});
define('web-desktop/views/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'login',
    classNames: ['login-badge'],
    isVisible: false,

    updateVisible: function () {
      var flag = this.get('controller.loginShow');
      if (flag) {
        this.set('isVisible', true);
      } else { // delay the dispear process
        Ember['default'].run.later(function () {
          this.set('isVisible', false);
        }.bind(this), 600);
      }
    }.observes('controller.loginShow'),

    shake: function () {
      if (this._state === 'inDOM' && this.get('controller.loginFail')) {
        var badge = this.$('.front');
        badge.addClass('animated swing');
        Ember['default'].run.later(function () {
          badge.removeClass('animated swing');
        }, 1000);
      } else {

      }
    }.observes('controller.loginFail'),

    onInputChange: function () {
      this.get('controller').set('loginFail', false);
    }.observes('emailAddr', 'password'),

    actions: {
      login: function () {
        this.get('controller').send('loginUser', {
          emailAddr: this.get('emailAddr') || 'yubin@gausian.com',
          password: this.get('password') || 'gausian'
        });
      },
      visitor: function () {
        this.get('controller').send('loginVisitor', {
          firstName: this.get('firstName'),
          lastName: this.get('lastName'),
          emailAddr: this.get('emailAddr'),
          invCode: this.get('invCode')
        });
      }
    }
  });

});
define('web-desktop/views/scroll-bar-handler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
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

});
define('web-desktop/views/scroll-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['jspVerticalBar'],
    templateName: 'scroll-bar',

    trackStyle: function () {
      console.log('trackStyle');
      return 'height: %@px'.fmt(this.get('trackLen')||0);
    }.property('trackLen'),

    jspActive: function (evt) {
      var offsetY =  evt.originalEvent.offsetY;
      Ember['default'].$('.overlay').on('mousemove', function (evt) { //TBD : better event handle
        Ember['default'].run.debounce(function () {
          var offset = evt.originalEvent.clientY - offsetY - this.$().offset().top;
          var slideLen = this.get('trackLen') - this.get('handlerLen');
          if (offset > 0 && offset < slideLen) {
            console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + offsetY + ' = ' + offset);

            this.set('handlerTop', offset);
            var percent = offset / slideLen;
            this.get('parentView').scrollList(percent);
          }
        }.bind(this), 50);

      }.bind(this));

      Ember['default'].$('.overlay').on('mouseup', function () {
        this.jspDeactive();

      }.bind(this));

    },

    jspDeactive: function () {
      Ember['default'].$('.overlay').off('mousemove');
    },

    // mouseMove: function (evt) {
    //     if (this.get('active')) {
    //
    //       var offset = evt.originalEvent.clientY - this.get('offsetY') - 142;
    //       if (offset > 0 && offset < this.get('trackLen') - this.get('handlerLen')) {
    //         console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + this.get('offsetY') + ' = ' + offset);
    //
    //         this.set('handlerTop', offset);
    //       }
    //
    //       // console.log(offset);
    //     }
    // }

  });

});
define('web-desktop/views/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    templateName: 'search-bar',
    classNames: ['search-bar'],
    query: '',

    didInsertElement: function () {
      this.$('.search').on('click', function () {
        this.set('query', '');
        this.$('.overlay').show();
        this.$('.search').hide();
        this.$('.overlay input').focus();
      }.bind(this));

      // this.$('.overlay').on('click', function () {
      //   this.$('.search').show();
      //   this.$('.overlay').hide();
      //   this.$('.overlay').off('mousemove');
      // }.bind(this));
      // this.$('.modal').on('click', function (evt) {
      //   evt.stopPropagation();
      // });


      this.$('.modal').on('mousewheel', function(event) {
        var viewLen = this.$('.container').height() - 20; // 20 is padding
        var contentLen = this.get('controller.resultDivHeight');
        var top = parseInt(this.$('.container ul').css('top'), 10);
        var range = contentLen - viewLen;
        if (range > 0) {
          top = top + event.deltaY;
          top = Math.min(top, 0);
          top = Math.max(top, -range);
          this.$('.container ul').css({top: top + 'px'});
          var handlerTop = -top/range * this.get('handlerLen');
          this.set('handlerTop', handlerTop);
        }
      }.bind(this));
    },

    queryUpdate: function () {
      var query = this.get('query');

      if (query) {
        Ember['default'].run.debounce(function () {
          this.get('controller').send('getSearchContent', query);
        }.bind(this), 500);
      } else {
        this.get('controller').set('searchContent', []);
      }
    }.observes('query'),

    keyUp: function (evt) {
      if (evt.keyCode === 27) {
        this.set('query', '');
        this.$('.search').show();
        this.$('.overlay').hide();
      }
    },

    updateHeight: function () {
      if (this.get('_state') === 'inDOM') {
        var viewLen = this.$('.container').height() - 20; // 20 is padding
        var contentLen = this.get('controller.resultDivHeight');
        var trackLen = viewLen;
        var handlerLen = trackLen * viewLen / contentLen;

        if (trackLen <= handlerLen) {
          this.setProperties({
            trackLen: 0,
            handlerLen: 0
          });
        } else {
          this.setProperties({
            trackLen: trackLen,
            handlerLen: handlerLen
          });
        }
      }
    }.observes('controller.resultDivHeight'),

    scrollList: function (percent) {
      var viewLen = this.$('.container').height() - 20; // 20 is padding
      var contentLen = this.get('controller.resultDivHeight');
      var top = (viewLen - contentLen) * percent;
      this.$('.container ul').css({top: top + 'px'});
    },

    actions: {
      cancel: function () {
          this.set('query', '');
          this.$('.search').show();
          this.$('.overlay').hide();
      }
    }

  });

});
define('web-desktop/views/search-results-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'search-results-item',
    classNames: ['search-results-item'],
    label: function () {
      if (this.get('content.installed')) {
        return 'Open';
      } else {
        return 'Get';
      }
    }.property('content.installed'),

    actions: {
      installApp: function () {
        this.set('content.installed', true);
        this.get('controller').send('installApp', this.get('content'));
      },

      openApp: function () {
        this.get('controller').send('openApp', this.get('content'));
        Ember['default'].$('.overlay').hide();
        Ember['default'].$('.search').show();
      }
    }
  });

});
define('web-desktop/views/search-results', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].CollectionView.extend({
    itemViewClass: 'search-results-item',
    tagName: 'ul',
    classNames: ['search-results'],
    onChildViewsChanged : function( obj, key ){
      var length = this.get( 'childViews.length' );
      if( length > 0 ){
        Ember['default'].run.scheduleOnce( 'afterRender', this, 'childViewsDidRender' );
      }
    }.observes('childViews'),

    childViewsDidRender : function(){
      this.get('controller').set('resultDivHeight', this.$().height());
    }
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('web-desktop/config/environment', ['ember'], function(Ember) {
  var prefix = 'web-desktop';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("web-desktop/tests/test-helper");
} else {
  require("web-desktop/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
//# sourceMappingURL=web-desktop.map