import Ember from 'ember';

var get = Ember.get;
export default Ember.Route.extend({

  beforeModel: function (params) {
    this.set('appinstall', get(params, 'queryParams.appinstall'));
  },
  model: function (params) {
    return {
      applist:[
        {
          app_name: "ASA",
          icon: 'http://asa.static.gausian.com/user_app/ASA/icon.png',
          viewName: 'customer',
          path: 'http://tianjiasun.github.io/ASA_api/app/index.html',
          screen: 2,
          col: 0,
          row: 0
        },
        {
          app_name: "Map",
          icon: 'http://asa.static.gausian.com/user_app/Map/icon.png',
          viewName: 'customer',
          path: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBrTaOSXSiXT1o7mUCjnJZSeRcSz0vnglw&q=silicon+valley',
          screen: 2,
          col: 3,
          row: 0
        },
        {
          app_name: "Customers",
          icon: 'http://asa.static.gausian.com/user_app/Customers/icon.png',
          viewName: 'customer',
          path: 'http://gausian-developers.github.io/user-app-template5/app/index.html',
          screen: 2,
          col: 1,
          row: 0
        },
        {
          app_name: "Quotes",
          icon: 'http://asa.static.gausian.com/user_app/Quotes/icon.png',
          viewName: 'customer',
          path: 'http://gausian-developers.github.io/user-app-template5/app/index.html',
          screen: 2,
          col: 2,
          row: 0
        },
        {
          app_name: "HipChat",
          icon: 'http://asa.static.gausian.com/user_app/HipChat/icon.png',
          viewName: 'customer',
          path: 'https://gausian.hipchat.com/chat',
          screen: 2,
          col: 0,
          row: 1
        },
        {
          app_name: "Pixlr",
          icon: 'http://asa.static.gausian.com/user_app/Pixlr/icon.png',
          viewName: 'customer',
          path: 'http://pixlr.com/editor/?loc=zh-cn',
          screen: 2,
          col: 1,
          row: 1
        },
        {
          app_name: "TakaBreak",
          icon: 'http://asa.static.gausian.com/user_app/TakaBreak/icon.png',
          viewName: 'customer',
          path: 'http://www.earbits.com/',
          screen: 2,
          col: 2,
          row: 1
        },
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
      Ember.$('.login-badge > .overlay').fadeOut( "slow", function() {
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
          Ember.$('.login-badge > .overlay').fadeOut( "slow", function() {
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

      Ember.$('.login-badge > .overlay').fadeOut( "slow", function() {
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
