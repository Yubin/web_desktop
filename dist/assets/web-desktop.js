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
          onStr = ids.map(function(i){return 'id='+i.id;}).join(' or ');
        } else { // only one
          onStr = 'id=' + ids.id;
        }
      } else { // Get All!

      }

      onStr = onStr ? 'ON ' + onStr : '';
      console.log(onStr);

      var requestStr = 'GET ' + onStr;
      return this.ajax(url, 'POST', {
        data: {requestString: requestStr},
        serviceAppName: 'UserAppInfo',
        userAppId: 'Fl2GDgDECXcbmJsBAJVayUhuLwkAAAA'
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
      console.log(rawHash);
      var userAppId = rawHash.userAppId; // app_id
      var serviceAppName = rawHash.serviceAppName;// Login
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

        hash.success = function (json/*, textStatus, jqXHR*/) {
          Ember['default'].run(null, resolve, json);
        };

        hash.error = function (jqXHR/*, textStatus, errorThrown*/) {
          Ember['default'].run(null, reject, adapter.ajaxError(jqXHR, function (hash) {
            console.error('ajax error');
            console.log(hash);
          }));
        };

        hash.url = url.toLowerCase();
        // hash.crossDomain = true;

        // CORS: This enables cookies to be sent with the request
        // hash.xhrFields = { withCredentials: true };

        Ember['default'].$.ajax(hash);
      }.bind(this), 'DS: AudienceAdapter#ajax ' + type + ' to ' + rawUrl);
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
        data: {requestString: JSON.stringify(query)},
        serviceAppName: 'Login',
        userAppId: 'Fl2GDgDECXcbmJsBAJVayUhuLwkAAAA'
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
define('web-desktop/components/trash-can', ['exports', 'ember', 'web-desktop/mixins/drag-n-drop-view'], function (exports, Ember, DragDrop) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend(DragDrop['default'].Droppable,{});

});
define('web-desktop/controllers/application', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({

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

    installApps: Ember['default'].computed.alias('controllers.application.user.installApps'),

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
        var name = get(item, 'app_name');
        var icon = get(item, 'icon');
        var find = this.get('openApps').any(function (it) {
          return get(it, 'app_name') === name;
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
            this.get('openApps').pushObject({app_name: name, icon: icon, instant: instant});
          }
        } else {
            var obj = this.get('openApps').findBy('app_name', name);
            // if user clicks a app icon and the app has been minimized
            if (obj.instant.get('isMinSize')) {
              obj.instant.showMinimizedApp();
            }
            // if user clicks a app icon and the app is not on top
            obj.instant.changeZindex();
        }
      },

      closeApp: function (item) {
        var name = get(item, 'app_name');
        var obj = this.get('openApps').findBy('app_name', name);

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

        apps.pushObject(
          Ember['default'].$.extend({
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

});
define('web-desktop/controllers/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ['applist', 'application'],
    openApps: Ember['default'].computed.alias('controllers.applist.openApps'),
    user: Ember['default'].computed.alias('controllers.application.user'),
    dock: function () {
      return this.get('openApps').slice(0, 10);
    }.property('openApps.length'),

    sendDock: function () {
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
              return Ember['default'].get(app, 'app_name').toLowerCase().indexOf(query.toLowerCase()) >=0;
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
define('web-desktop/mixins/window-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
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
      Ember['default'].$('.window').each(function () {
        var z = parseInt(Ember['default'].$(this).css('z-index'));
        if (z > zindex) {
          zindex = z;
        }
        Ember['default'].$(this).removeClass('active');
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
        var max_height = this.$(document).height() - 77;
        console.log(max_height);
        if (this.get('isFullSize')) {
          this.$().animate({ // image follow
            'top': this.get('top'),
            'left': this.get('left'),
            'width': this.get('width'),
            'height': this.get('height')
          });
        } else {
          this.$().animate({ // image follow
            'top': 47,
            'left': 0,
            'width': '100%',
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
    app_name: DS['default'].attr('string'),
    last_version: DS['default'].attr('string'),
    show_in_store: DS['default'].attr('boolean'),
    pricing_by_month: DS['default'].attr('number'),
    security_level: DS['default'].attr('string'),
    certified: DS['default'].attr('boolean'),
    default_install: DS['default'].attr('boolean'),
    subscribed_services: DS['default'].attr('string'),
    output_service_id: DS['default'].attr('string'),
    input_service_id: DS['default'].attr('string'),
    censorship_date: DS['default'].attr('string'),
    path: DS['default'].attr('string'),
    icon: DS['default'].attr('string'),
    screen: DS['default'].attr('number', {defaultValue: 0}),
    row: DS['default'].attr('number', {defaultValue: 0}),
    col: DS['default'].attr('number', {defaultValue: 0})
  });

});
define('web-desktop/models/login', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    user_name: DS['default'].attr('string'),
    pwd: DS['default'].attr('string')
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
  exports['default'] = Ember['default'].Route.extend({

    beforeModel: function (params) {
      this.set('appinstall', get(params, 'queryParams.appinstall'));
    },
    model: function (params) {
      return {
        applist:[
          {
            app_name: "ASA API",
            icon: "img/icon_17.png",
            viewName: 'customer',
            path: 'http://tianjiasun.github.io/ASA_api/app/index.html',
            screen: 0,
            col: 0,
            row: 4
          }
        ]
      };
    },

    setupController: function (controller, model) {
      var ctl = this.controllerFor('applist');
      ctl.reset();
      ctl.set('model', get(model , 'applist'));
      ctl.set('appinstall', this.get('appinstall'));

      var user = {};
      try {
        user = JSON.parse(localStorage.getItem('gausian-user'));
      } catch (e) {
        console.error(e);
      }
      console.log(user);
      this.get('controller').set('user', user);
    },

    renderTemplate: function() {
      this.render();
      this.render('applist', {
        outlet: 'applist',
        into: 'application'
      });
    },

    actions: {
      appMoving: function () {
        this.set('controller.appMoving', true);
      },
      appStop: function () {
        this.set('controller.appMoving', false);
      },
      installApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['addApp'].apply(ctrl, arguments);
      },
      openApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['openApp'].apply(ctrl, arguments);
      },
      loginShow: function () {
        this.render('login', {
          outlet: 'login',
          into: 'application'
        });
      },
      loginClose: function () {
        Ember['default'].$('.login-badge > .overlay').fadeOut( "slow", function() {
          this.disconnectOutlet({
            outlet: 'login',
            parentView: 'application'
          });
        }.bind(this));
      },

      loginUser: function (content) {

        this.store.createRecord('login', {
          user_name: get(content, 'emailAddr'),
          pwd: get(content, 'password')
        }).save().then(function (res) {
          console.log(res);
          var responseBody = res._data.response;
          var responseCode = res._data.response_code;
          if (res._data.response_code !== 1) {
            this.get('controller').set('loginFail', true);
          } else {
            var user = {
              firstName: get(responseBody, 'user.first'),
              lastName: get(responseBody, 'user.last'),
              emailAddr: get(content, 'emailAddr'),
              isLogin: true,
              loginType: 1,
              signUpDate: get(res, 'signup_date'),
              token: 'asdfasdfasdf',
              companies: get(responseBody, 'companies'),
              installApps: get(responseBody, 'installed_apps'),
              current_compony_id: get(responseBody, 'current_login_company')
            };
            this.get('controller').set('user', user);
            localStorage.setItem('gausian-user', JSON.stringify(user));
            Ember['default'].$('.login-badge > .overlay').fadeOut( "slow", function() {
              this.disconnectOutlet({
                outlet: 'login',
                parentView: 'application'
              });
            }.bind(this));
          }
        }.bind(this));
      },

      loginVisitor: function (content) {

        var user = {
          firstName: get(content, 'firstName'),
          lastName: get(content, 'lastName'),
          emailAddr: get(content, 'emailAddr'),
          invCode: get(content, 'invCode'),
          isLogin: true,
          loginType: 2,
          token: 'asdfasdfasdf'
        };
        this.get('controller').set('user', user);
        localStorage.setItem('gausian-user', JSON.stringify(user));

        Ember['default'].$('.login-badge > .overlay').fadeOut( "slow", function() {
          this.disconnectOutlet({
            outlet: 'login',
            parentView: 'application'
          });
        }.bind(this));
      },

      changeCompany: function (id) {
        this.get('controller').set('user.current_compony_id', id);
      },

      SignOut: function () {
        this.get('controller').setProperties({
          isLogin: false,
          loginType: 0
        });
        this.refresh();
        localStorage.setItem('gausian-user', null);
      }
    }
  });

});
define('web-desktop/serializers/app-info', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

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
          console.error('serializer - app-info failed to parse response: ' +response);
        }
      }
      console.log(obj);
      return obj;
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
define('web-desktop/templates/app/customer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<iframe ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.path")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\" frameBorder=\"0\"></iframe>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/deliver-bid', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/einventory', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/vendor-match', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"effect fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-edge fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-img fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-text fadeIn fadeIn-50ms fadeIn-Delay-100ms\">");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.app_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("</div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n	");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "render", "header", options))));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "trash-can", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    data.buffer.push("<!-- DESKTOP -->\n\n");
    stack1 = helpers.unless.call(depth0, "controller.appMoving", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "searchBar", options) : helperMissing.call(depth0, "render", "searchBar", options))));
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "applist", options) : helperMissing.call(depth0, "outlet", "applist", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "controller.appMoving", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "login", options) : helperMissing.call(depth0, "outlet", "login", options))));
    data.buffer.push("\n\n<svg version=\"1.1\" xmlns='http://www.w3.org/2000/svg'>\n  <filter id='blur'>\n    <feGaussianBlur stdDeviation='6' />\n  </filter>\n</svg>\n");
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
    
    var buffer = '';
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appscreen", {hash:{
      'index': ("id"),
      'hasApp': ("hasApp")
    },hashTypes:{'index': "ID",'hasApp': "ID"},hashContexts:{'index': depth0,'hasApp': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appicon", {hash:{
      'content': ("app")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("\n\n\n  ");
    stack1 = helpers.each.call(depth0, "view.controller.screens", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  <ul>\n    ");
    stack1 = helpers.each.call(depth0, "app", "in", "view.controller.model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\n");
    
  });

});
define('web-desktop/templates/components/star-rating', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n  <i class=\"fa fa-star\"></i>\n");
    }

    stack1 = helpers.each.call(depth0, "stars", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('web-desktop/templates/components/trash-can', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\n<div class=\"trash fadeIn fadeIn-50ms fadeIn-Delay-20ms fadeOut fadeOut-50ms\">DELETE</div>\n");
    
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
    data.buffer.push(");\"></div>\n<em><span>");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.app_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("</span></em>\n");
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
    
    
    data.buffer.push("\n  <ul class=\"dropdown-menu-left\">\n    <li>\n      <a>Company Info</a>\n    </li>\n    <li>\n      <a>Create New Accounts</a>\n    </li>   \n  </ul>\n  ");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <span>\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showProfile", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "user.firstName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "user.lastName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n      </span>\n\n      ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n      <span>\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "loginShow", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Sign up / Log in</a>\n        <img src=\"assets/img/GAUSIAN_logo.png\" >\n      </span>\n      ");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <ul class=\"dropdown-menu pull-right\">\n    <li>\n      <a>My Account</a>\n    </li>\n    ");
    stack1 = helpers.each.call(depth0, "user.companies", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    <li>\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "SignOut", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Sign Out</a>\n    </li>\n  </ul>\n  ");
    return buffer;
    }
  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <li>\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeCompany", "id", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n    </li>\n    ");
    return buffer;
    }

    data.buffer.push("<ul class=\"nav fadeIn fadeIn-50ms fadeOut fadeOut-50ms\">\n  <li class=\"logo fadeIn fadeIn-50ms\">\n    <span>\n      <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showProfile_comp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("> ");
    stack1 = helpers._triageMustache.call(depth0, "view.companyName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </a>\n    </span>\n  </li>\n  ");
    stack1 = helpers['if'].call(depth0, "view.showProfile_comp", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "header-dock", {hash:{
      'content': ("dock")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n\n  <li class=\"login fadeIn fadeIn-50ms\">\n      ");
    stack1 = helpers['if'].call(depth0, "user.isLogin", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </li>\n  ");
    stack1 = helpers['if'].call(depth0, "view.showProfile", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</ul>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<div class=\"overlay fadeIn fadeIn-50ms\">\n  <i class=\"icon-remove modal-close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "loginClose", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("></i>\n  <div class=\"blur-image\"></div>\n  <div class=\"flip-container fadeIn fadeIn-100ms\">\n    <div id=\"flipper\" class=\"\">\n      <div class=\"front\">\n        <div class=\"badge_band_right\"></div>\n        <div class=\"badge_band_left\"></div>\n        <div class=\"badge_band_left_shadow\"></div>\n        <div class=\"badge_band_end\"></div>\n        <a href=\"http://www.gausian.com\">\n          <div class=\"badge_buckle\">\n            <img class=\"logo_img\" src=\"assets/img/GAUSIAN_logo.png\">\n          </div>\n        </a>\n        <div class=\"badge_buckle_shadow\"></div>\n        <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":badge_container loginFail:has-error loginFail")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n          <div class=\"up_container\">\n            <img class=\"up_img\" src=\"assets/img/einstein.png\" onclick=\"\n              flipper.classList.toggle('flipped');\n              document.getElementById('visitor_container').style.opacity=0;\n              document.getElementById('sign_container').style.opacity=0;\n              document.getElementById('portrait_container').style.opacity=1;\n              \">\n            <div id=\"up_hole\"></div>\n          </div>\n          <div class=\"down_container\">\n            <div class=\"company_name\"> Your Company Name </div>\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.emailAddr"),
      'class': ("email_input visitor_input"),
      'placeholder': ("Email")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("password"),
      'value': ("view.password"),
      'class': ("pw_input"),
      'placeholder': ("Password")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"login_bn\">Login</button>\n\n            <div class=\"sign_bn fadeIn fadeIn-100ms fadeIn-Delay-50ms\" onclick=\"\n              flipper.classList.toggle('flipped');\n              document.getElementById('visitor_container').style.opacity=0;\n              document.getElementById('sign_container').style.opacity=1;\n              document.getElementById('portrait_container').style.opacity=0;\n              \">\n              Sign up\n            </div>\n            <div class=\"visitor_bn fadeIn fadeIn-100ms fadeIn-Delay-50ms\" onclick=\"\n              flipper.classList.toggle('flipped');\n              document.getElementById('visitor_container').style.opacity=1;\n              document.getElementById('sign_container').style.opacity=0;\n              document.getElementById('portrait_container').style.opacity=0;\n              \">\n              I'm a Visitor\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"back\">\n        <div class=\"badge_band_right\"></div>\n        <div class=\"badge_band_left\"></div>\n        <div class=\"badge_band_left_shadow\"></div>\n        <div class=\"badge_band_end\"></div>\n        <div class=\"badge_buckle\"></div>\n        <div class=\"badge_buckle_back\"></div>\n        <div class=\"badge_buckle_shadow\"></div>\n        <div class=\"badge_container\">\n          <div class=\"up_container\">\n            <img class=\"up_img\" src=\"assets/img/empty.png\">\n            <div id=\"up_hole\"></div>\n          </div>\n          <img class=\"return_icon\" src=\"assets/img/return.png\" onclick=\"flipper.classList.toggle('flipped');\">\n          <div class=\"down_container\"></div>\n          <div id=\"sign_container\" style=\"opacity: 0;\">\n            <div class=\"back_container_header\">Sign up</div>\n            <input class=\"back_container_input_first\" type=\"text\" placeholder=\"First\">\n            <input class=\"back_container_input_last\" type=\"text\" placeholder=\"Last\">\n            <input class=\"back_container_input_email\" type=\"text\" placeholder=\"Email\">\n            <input class=\"back_container_input_company\" type=\"text\" placeholder=\"Full Company Name\">\n            <input class=\"back_container_input_pw\" type=\"password\" placeholder=\"Password\">\n            <a href=\"http://yubin.github.io/web_desktop\">\n              <div class=\"back_container_sign\">Sign</div>\n            </a>\n            <div class=\"back_container_invite\">Invite</div>\n          </div>\n          <div id=\"visitor_container\" style=\"opacity: 0;\">\n            <div class=\"back_container_header\">Visitor to</div>\n            <div class=\"visitor_input_company_name\">You Company Name</div>\n\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.firstName"),
      'class': ("visitor_input_first visitor_input"),
      'placeholder': ("First")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.lastName"),
      'class': ("visitor_input_last visitor_input"),
      'placeholder': ("Last")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.emailAddr"),
      'class': ("visitor_input_email visitor_input"),
      'placeholder': ("Email")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.invCode"),
      'class': ("visitor_input_security visitor_input"),
      'placeholder': ("Invitation Code")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "visitor", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"back_container_enter\">Enter</button>\n          </div>\n          <div id=\"portrait_container\" style=\"opacity: 1;\">\n            <div class=\"back_container_header\">Change Portrait</div>\n            <div class=\"portrait_container\">\n              <img class=\"portrait_img\" src=\"assets/img/einstein_5.png\">\n            </div>\n            <input class=\"portrait_email\" type=\"text\" placeholder=\"Email\">\n            <input class=\"portrait_pw\" type=\"password\" placeholder=\"Password\">\n            <div class=\"portrait_apply\">Apply New Portrait</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
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
    data.buffer.push(">\n  <div class=\"jspDragTop\"></div>\n  <div class=\"jspDragBottom\"></div>\n</div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/scroll-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"jspCap jspCapTop\"></div>\n<div class=\"jspTrack\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.trackStyle")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar-handler", {hash:{
      'len': ("view.handlerLen"),
      'top': ("view.handlerTop")
    },hashTypes:{'len': "ID",'top': "ID"},hashContexts:{'len': depth0,'top': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n</div>\n<div class=\"jspCap jspCapBottom\"></div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"search fadeIn fadeIn-50ms fadeIn-Delay-20ms\">\n  <div class=\"search-icon\"></div>\n  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Search APP or Content"),
      'disabled': (true)
    },hashTypes:{'type': "STRING",'placeholder': "STRING",'disabled': "BOOLEAN"},hashContexts:{'type': depth0,'placeholder': depth0,'disabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n</div>\n\n<div class=\"overlay\">\n  <div class=\"modal fadeIn fadeIn-50ms\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.query")
    },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n    <a class=\"cancel_search\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Cancel</a>\n    <div class=\"container\">\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "search-results", {hash:{
      'content': ("view.controller.searchContent")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar", {hash:{
      'trackLen': ("view.trackLen"),
      'handlerLen': ("view.handlerLen"),
      'handlerTop': ("view.handlerTop")
    },hashTypes:{'trackLen': "ID",'handlerLen': "ID",'handlerTop': "ID"},hashContexts:{'trackLen': depth0,'handlerLen': depth0,'handlerTop': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n    </div>\n  </div>\n</div>\n");
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
    data.buffer.push("\n<a class=\"action open\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "openApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</a>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n<a class=\"action get\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "installApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</a>\n");
    return buffer;
    }

    data.buffer.push("<div class=\"icon\">\n  <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" />\n</div>\n<div class=\"detail\">\n  <a class=\"name\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.app_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n  <a class=\"star-rating\"> ");
    data.buffer.push(escapeExpression((helper = helpers['star-rating'] || (depth0 && depth0['star-rating']),options={hash:{
      'content': ("view.content.rating")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "star-rating", options))));
    data.buffer.push(" </a>\n  <a class=\"category\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.category", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n  <a class=\"price\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.freeDay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" days free trail, $");
    stack1 = helpers._triageMustache.call(depth0, "view.content.pricing_by_month", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" /month</a>\n</div>\n");
    stack1 = helpers['if'].call(depth0, "view.content.installed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('web-desktop/templates/window', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"header\">\n  <span class=\"titleInside\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.app_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n</div>\n<nav class=\"control-window\">\n  <a href=\"#\" class=\"minimize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "minimizeApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">minimize</a>\n  <a href=\"#\" class=\"maximize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "maximizeApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">maximize</a>\n  <a href=\"#\" class=\"close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeApp", "view.content", {hash:{
      'target': ("view.parentView")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">close</a>\n</nav>\n<div class=\"container\">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
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
    ok(true, 'adapters/base.js should pass jshint.'); 
  });

});
define('web-desktop/tests/adapters/login.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/login.js should pass jshint', function() { 
    ok(true, 'adapters/login.js should pass jshint.'); 
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
define('web-desktop/tests/models/login.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/login.js should pass jshint', function() { 
    ok(true, 'models/login.js should pass jshint.'); 
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
    ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 9, col 20, \'params\' is defined but never used.\nroutes/application.js: line 56, col 27, \'content\' is defined but never used.\nroutes/application.js: line 60, col 24, \'content\' is defined but never used.\nroutes/application.js: line 87, col 13, \'responseCode\' is defined but never used.\n\n4 errors'); 
  });

});
define('web-desktop/tests/serializers/app-info.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/app-info.js should pass jshint', function() { 
    ok(true, 'serializers/app-info.js should pass jshint.'); 
  });

});
define('web-desktop/tests/serializers/login.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/login.js should pass jshint', function() { 
    ok(true, 'serializers/login.js should pass jshint.'); 
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
define('web-desktop/tests/views/app/customer.jshint', function () {

  'use strict';

  module('JSHint - views/app');
  test('views/app/customer.js should pass jshint', function() { 
    ok(true, 'views/app/customer.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/app/deliver-bid.jshint', function () {

  'use strict';

  module('JSHint - views/app');
  test('views/app/deliver-bid.js should pass jshint', function() { 
    ok(true, 'views/app/deliver-bid.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/app/einventory.jshint', function () {

  'use strict';

  module('JSHint - views/app');
  test('views/app/einventory.js should pass jshint', function() { 
    ok(true, 'views/app/einventory.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/app/gausian-store.jshint', function () {

  'use strict';

  module('JSHint - views/app');
  test('views/app/gausian-store.js should pass jshint', function() { 
    ok(true, 'views/app/gausian-store.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/app/vendor-match.jshint', function () {

  'use strict';

  module('JSHint - views/app');
  test('views/app/vendor-match.js should pass jshint', function() { 
    ok(true, 'views/app/vendor-match.js should pass jshint.'); 
  });

});
define('web-desktop/tests/views/appicon.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/appicon.js should pass jshint', function() { 
    ok(false, 'views/appicon.js should pass jshint.\nviews/appicon.js: line 110, col 22, \'evt\' is defined but never used.\n\n1 error'); 
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
    ok(false, 'views/applist.js should pass jshint.\nviews/applist.js: line 4, col 5, \'KEYS\' is defined but never used.\n\n1 error'); 
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
    ok(true, 'views/header.js should pass jshint.'); 
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
    ok(false, 'views/search-results-item.js should pass jshint.\nviews/search-results-item.js: line 22, col 7, \'$\' is not defined.\nviews/search-results-item.js: line 23, col 7, \'$\' is not defined.\n\n2 errors'); 
  });

});
define('web-desktop/tests/views/search-results.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/search-results.js should pass jshint', function() { 
    ok(false, 'views/search-results.js should pass jshint.\nviews/search-results.js: line 7, col 40, \'key\' is defined but never used.\nviews/search-results.js: line 7, col 35, \'obj\' is defined but never used.\n\n2 errors'); 
  });

});
define('web-desktop/tests/views/window.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/window.js should pass jshint', function() { 
    ok(false, 'views/window.js should pass jshint.\nviews/window.js: line 19, col 11, \'offsetX\' is defined but never used.\nviews/window.js: line 20, col 11, \'offsetY\' is defined but never used.\n\n2 errors'); 
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
define('web-desktop/views/app/customer', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {
    templateName: 'app/customer'
  });

});
define('web-desktop/views/app/deliver-bid', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 5,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {
      console.log('onImageChange');

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/DeliverBid_%@.jpg'.fmt(index));
      if (index === 1 || index === 4) {
        this.$('img.spinner').show();
        Ember['default'].run.later(function () {
          this.set('index', index + 1);
          this.$('img.spinner').hide();
        }.bind(this), 600);
      }

    }.observes('index')

  });

});
define('web-desktop/views/app/einventory', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/einventory',
    finalIndex: 3,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {
      console.log('onImageChange');

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/VenderMatch_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/app/gausian-store', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 4,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/Gausian_Store_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/app/vendor-match', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 3,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/Einventory_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    tagName: 'li',
    templateName: 'appicon',
    attributeBindings : [ 'draggable' ],
    draggable         : 'true',


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
      this.$().draggable();
      this.handleSize();
      this.position();
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


    position: function (row, col, scr, duration) {
      row = !Ember['default'].isEmpty(row) ? row : this.get('row');
      col = !Ember['default'].isEmpty(col) ? col : this.get('col');
      scr = !Ember['default'].isEmpty(scr) ? scr : this.get('scr');
      var iconWidth = this.get('iconWidth');
      var iconHeight = this.get('parentView.iconHeight');
      var offsetHeight = this.get('parentView.offsetHeight');
      var offsetWidth  = this.get('parentView.offsetWidth');

      var screnWidth = this.get('parentView.screenWidth');
      var widthOffset = this.get('parentView.widthOffset');
      var screenLeft = scr * (screnWidth + widthOffset) + widthOffset;

      var top  = (iconHeight + offsetHeight) * row + offsetHeight;
      var left = (iconWidth + offsetWidth) * col + offsetWidth + screenLeft;

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

    mouseDown: function (event) {
      var originEvt = event.originalEvent;
      var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
      var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

      this.$().addClass('dragging');
      this.get('parentView').onMouseDown(this, offsetX, offsetY);
    },

    mouseUp: function (evt) {
      this.$().removeClass('dragging');
      return true;
    }

  });

});
define('web-desktop/views/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['application']
  });

});
define('web-desktop/views/applist', ['exports', 'ember', 'web-desktop/utils/keys'], function (exports, Ember, keyUtils) {

  'use strict';

  var KEYS = keyUtils['default'].KEYS;
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
      this.handleSize();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    didInsertElement: function () {
      this.handleSize();
    },

    handleSize: function () {

      var minWidthIcon = 48;
      var minHeightWin = 600;
      var minWidthWin = 800;
      var winWidth  = Math.max(Ember['default'].$(window).width(), minWidthWin);
      var winHeight = Math.max(Ember['default'].$(window).height()*0.85, minHeightWin);

      var height = (winHeight) * 0.9;
      var width = winWidth / 3 * 0.86 ;
      var widthOffset = (winWidth - 3 * (width)) / 4;

      var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
      var iconHeight = iconWidth * 4 / 3;

      var offsetWidth  = (width - iconWidth * 4) / 5;
      var offsetHeight = (height - iconHeight * 5) / 6;

      this.setProperties({
        screenWidth:  width,
        screenHeight: height,
        screenTop:    0,
        widthOffset:  widthOffset,
        iconWidth:    iconWidth,
        iconHeight:   iconHeight,
        offsetHeight: offsetHeight,
        offsetWidth:  offsetWidth
      });
    },

    getScreenRowCol: function (left, top) {
      var offsetWidth = this.get('offsetWidth');
      var offsetHeight = this.get('offsetHeight');
      var screenWidth = this.get('screenWidth');
      var widthOffset = this.get('widthOffset');
      var screenLeft = screenWidth + widthOffset + 10;

      var newScr = 0;
      for (var i = 0 ; i < 3; i++) {
        if (left >= screenLeft * i + widthOffset && left < screenLeft * (i + 1) + widthOffset) {
          newScr = i;
        }
      }

      var newCol = Math.round((left - offsetWidth/2 - newScr * screenLeft - widthOffset) * 4 / screenWidth);
      var newRow = Math.round((top - offsetHeight/2) * 5 / this.get('screenHeight'));

      newCol = newCol < 0 ? 0: newCol;
      newCol = newCol > 3 ? 3: newCol;
      return {row: newRow, col: newCol, scr: newScr};
    },

    onMouseDown: function (app, offsetX, offsetY) { // this will be called by item
      this.setProperties({
        'activeApp': app,
        'offsetX': offsetX,
        'offsetY': offsetY
      });

      this.$(document).on('mousemove', this.onMouseMove.bind(this));
      this.on('mouseUp', this.onMouseRelease);
      //this.on('mouseLeave', this.onMouseRelease);
    },

    onMouseMove: function (event) {
      this.get('controller').send('appMoving');
      this.set('appTouch', true);
      var node = this.get('activeApp');
      var originEvt = event.originalEvent;
      var offset = node.$().parent().offset(); // TBD
      var x = originEvt.clientX - this.get('offsetX') - offset.left;
      var y = originEvt.clientY - this.get('offsetY') - offset.top;

      if (y < -100) {
        console.log(this.get('deleting'));
        if (this.get('deleting') >= 5) {
          this.get('controller').send('deleteApp', node.get('content'));
          this.set('deleting', 0);
          this.set('deleted', true);
        }
        this.incrementProperty('deleting');
      } else {
        this.set('deleting', 0);
        this.set('deleted', false);
      }

      if (this.get('deleted')) {
        this.$(document).off('mousemove');
        this.off('mouseUp', this.onMouseRelease);
        this.set('deleted', false);
        this.set('appTouch', false);
        this.get('controller').send('appStop');
        return;
      }
      node.$().css({ // image follow
        'top': y,
        'left': x,
        'z-index': '100'
      });
      var rowCol = this.getScreenRowCol(x, y);
      if (node.get('row') !== rowCol.row ||
          node.get('col') !== rowCol.col ||
          node.get('scr') !== rowCol.scr) {
        this.shuffle({
          row: node.get('row'),
          col: node.get('col'),
          scr: node.get('scr')
        }, rowCol);
      }
    },

    onMouseRelease: function () {
      var node = this.get('activeApp');
      node.$().removeClass('dragging');
      this.$(document).off('mousemove');
      this.off('mouseUp', this.onMouseRelease);
      // this.off('mouseLeave', this.onMouseRelease);
      node.position(node.get('row'), node.get('col'), node.get('scr'), 300);

      node.$().css({
        'z-index': 1
      });
      if (!this.get('appTouch')) {
        this.get('controller').send('openApp', node.get('content'));
      }
      this.set('appTouch', false);
      this.get('controller').send('appStop');
    },

    shuffle: function (from, to) {  // TBD add screen constrain
      console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
      var isSamePosition = function (pos1, pos2) {
        return get(pos1, 'col') === get(pos2, 'col') &&
        get(pos1, 'row') === get(pos2, 'row') &&
        get(pos1, 'scr') === get(pos2, 'scr');
      };
      this.get('childViews').forEach(function (itemView) {
        if (isSamePosition(itemView, to)) { // swap
          itemView.position(get(from, 'row'), get(from, 'col'), get(from, 'scr'), 200);
        } else if (isSamePosition(itemView, from)) { // target
          itemView.setProperties({
            col: get(to, 'col'),
            row: get(to, 'row'),
            scr: get(to, 'scr')
          });
        }
      });
    },
  });

});
define('web-desktop/views/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    // templateName: 'appscreen',
    classNames: ['appscreen', 'appscreen-set', 'dropzone', 'fadeIn', 'fadeIn-50ms','fadeIn-Delay-50ms'],
    classNameBindings: ['appTouch:background', 'hasApp'],
    appTouch: false,
    hasApp: false,

    init: function () {
      this._super();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    handleSize: function () {
      var index = this.get('index') || 0;
      var width = this.get('parentView.screenWidth');
      var widthOffset = this.get('parentView.widthOffset');
      var left = index * (width + widthOffset) + widthOffset;
      this.$().css({
        top: this.get('parentView.screenTop'),
        left: left,
        width: width,
        height: this.get('parentView.screenHeight')
      });
    }.on('didInsertElement')


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
    templateName: 'header',
    width_dock_icon: 52,
    width_dock_corner: 25,
    width_sync: 0,
    showProfile: false,
    showProfile_comp: false,
    companyName: function () {
      var name = 'Company Name';
      var companies = this.get('controller.user.companies');
      var id = this.get('controller.user.current_compony_id');
      if (!Ember['default'].isEmpty(companies) && !Ember['default'].isEmpty(id)) {
        var obj = companies.findBy('id', parseInt(id));
        name = Ember['default'].get(obj, 'app_name');
      }

      return name;
    }.property('controller.user.companies.[]', 'controller.user.current_compony_id'),

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
    },
    didInsertElement: function () {
      this.adjustSize();
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
      }
    }

  });

});
define('web-desktop/views/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'login',
    classNames: ['login-badge'],

    shake: function () {
      if (this._state === 'inDOM' && this.get('controller.loginFail')) {
        var badge = this.$('.front .badge_container');
        badge.addClass('shake');
        Ember['default'].run.later(function () {
          badge.removeClass('shake');
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
        $('.overlay').hide();
        $('.search').show();
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
define('web-desktop/views/window', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
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
        Ember['default'].$(this).off('mousemove');
      });

    },

    willDestroyElement: function () {
      this.$('.header').on('mousedown');
      this.$('.header').on('mouseup');
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