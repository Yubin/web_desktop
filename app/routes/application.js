import Ember from 'ember';

var get = Ember.get;
var isEmpty = Ember.isEmpty;

export default Ember.Route.extend({

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
