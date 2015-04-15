import Ember from 'ember';

var get = Ember.get;
export default Ember.Route.extend({

  beforeModel: function (params) {
    this.set('appinstall', get(params, 'queryParams.appinstall'));
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

    var user = {};
    // try {
    //   user = JSON.parse(localStorage.getItem('gausian-user'));
    // } catch (e) {
    //   console.error(e);
    // }
    // console.log(user);
    // if (user && get(user, 'id')) {
    //   this.store.find('employee', get(user, 'id'));
    // }
    controller.setProperties({
      'user': user,
      'employee': {id: 1},
      'current_login_company': 0
    });
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
        var responseBody = res._data.response;
        var responseCode = res._data.response_code;
        console.log(responseBody);
        if (res._data.response_code !== 1) {
          this.get('controller').set('loginFail', true);
        } else {
          this.get('controller').setProperties({
            isLogin: true,
            'companies': get(responseBody, 'companies'),
            'user': get(responseBody, 'user'),
            'employee': get(responseBody, 'employee_info'),
            'current_login_company': get(responseBody, 'current_login_company')
          });
          // localStorage.setItem('gausian-user', JSON.stringify(user));
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
      this.get('controller').setProperties({
        isLogin: true,
        'user': user
      });
      // localStorage.setItem('gausian-user', JSON.stringify(user));
      this.set('controller.loginShow', false);
    },

    changeCompany: function (id) {
      this.store.createRecord('user-company', {'company_id': id}).save().then(function (res) {
        this.get('controller').setProperties({
          'current_login_company': id,
          'employee': get(res, '_data.employee_info')
        });
      }.bind(this));
    },

    SignOut: function () {

      this.store.createRecord('logout').save().then(function (res) {
        var responseBody = res._data.response;
        var responseCode = res._data.response_code;
        console.log(responseBody);
        this.get('controller').setProperties({
          isLogin: false,
          loginType: 0,
          user: {},
          'employee': {id: 1},
          'current_login_company': 0
        });
        // this.refresh();
      }.bind(this));
      // localStorage.setItem('gausian-user', null);
    }
  }
});
