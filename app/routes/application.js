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
          name: "Gausian Store",
          icon: "img/icon_17.png",
          viewName: 'gausianStore',
          screen: 0,
          col: 0,
          row: 0
        }
      ]
    };
  },

  setupController: function (controller, model) {
    var ctl = this.controllerFor('applist');
    ctl.reset();
    ctl.set('model', get(model, 'applist'));
    ctl.set('appinstall', this.get('appinstall'));

    var user = {};
    try {
      user = JSON.parse(localStorage.getItem('gausian-user'));
    } catch (e) {
      console.error(e);
    }
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
