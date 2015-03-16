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
          app_id: "customerApp",
          icon: 'http://asa.static.gausian.com/user_app/Customers/icon.png',
          viewName: 'customer',
          path: 'http://gausian-developers.github.io/user-app-template5/app/',
          screen: 2,
          col: 1,
          row: 0
        },
        {
          app_name: "Quotes",
          icon: 'http://asa.static.gausian.com/user_app/Quotes/icon.png',
          viewName: 'customer',
          path: 'http://gausian-developers.github.io/user-app-template6/app/',
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
        {
          app_name: "EasyInvoice",
          icon: 'http://asa.static.gausian.com/user_app/EasyInvoice/icon.png',
          viewName: 'customer',
          path: 'http://invoiceto.me/',
          screen: 2,
          col: 3,
          row: 1
        },
        {
          app_name: "LiveCAM",
          icon: 'http://asa.static.gausian.com/user_app/LiveCAM/icon.png',
          viewName: 'customer',
          path: 'http://trafficcam.santaclaraca.gov/TrafficCamera.aspx?CID=GA101',
          screen: 2,
          col: 0,
          row: 2
        },
        {
          app_name: "Math",
          icon: 'http://asa.static.gausian.com/user_app/Math/icon.png',
          viewName: 'customer',
          path: 'https://www.mathway.com/graph',
          screen: 2,
          col: 1,
          row: 2
        },
        {
          app_name: "Withholding",
          icon: 'http://asa.static.gausian.com/user_app/Withholding/icon.png',
          viewName: 'customer',
          path: 'http://apps.irs.gov/app/withholdingcalculator/',
          screen: 2,
          col: 2,
          row: 2
        },
        {
          app_name: "JSON Viewer",
          icon: 'http://asa.static.gausian.com/user_app/JSON/icon.png',
          viewName: 'customer',
          path: 'http://jsonviewer.stack.hu/',
          screen: 2,
          col: 3,
          row: 2
        },
        {
          app_name: "Weather",
          icon: 'http://asa.static.gausian.com/user_app/Weather/icon.png',
          viewName: 'customer',
          path: 'http://chrome.wunderground.com/auto/chrome/geo/wx/index.html?query=95054',
          screen: 2,
          col: 0,
          row: 3
        },
        {
          app_name: "FloorPlans",
          icon: 'http://asa.static.gausian.com/user_app/FloorPlans/icon.png',
          viewName: 'customer',
          path: 'https://planner5d.com/app-chrome/?key=3a95cf1e2b3c5c74ff7ee00871a49c8b',
          screen: 2,
          col: 1,
          row: 3
        },
        {
          app_name: "Draw",
          icon: 'http://asa.static.gausian.com/user_app/Draw/icon.png',
          viewName: 'customer',
          path: 'http://www.ratemydrawings.com/canvasdraw/',
          screen: 2,
          col: 2,
          row: 3
        },
        {
          app_name: "3D",
          icon: 'http://asa.static.gausian.com/user_app/3D/icon.png',
          viewName: 'customer',
          path: 'http://www.3dtin.com/2cwe',
          screen: 2,
          col: 3,
          row: 3
        },
        {
          app_name: "Calculator",
          icon: 'http://asa.static.gausian.com/user_app/Calculator/icon.png',
          viewName: 'customer',
          path: 'http://scientific-calculator.appspot.com/',
          screen: 2,
          col: 0,
          row: 4
        },
        {
          app_name: "Developer",
          icon: 'http://asa.static.gausian.com/user_app/Developer/icon.png',
          viewName: 'customer',
          path: 'http://tianjiasun.github.io/ASA_website/',
          screen: 2,
          col: 1,
          row: 4
        },
        {
          app_name: "SimpleToDo",
          icon: 'http://asa.static.gausian.com/user_app/SimpleToDo/icon.png',
          viewName: 'customer',
          path: 'http://scrumy.com/husks11rubbish',
          screen: 2,
          col: 2,
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
    // if (user && get(user, 'id')) {
    //   this.store.find('employee', get(user, 'id'));
    // }
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

    installApp: function (content) {
      var ctrl = this.controllerFor('applist');
      ctrl._actions['addApp'].apply(ctrl, arguments);
    },

    openApp: function (content) {
      var ctrl = this.controllerFor('applist');
      ctrl._actions['openApp'].apply(ctrl, arguments);
    },

    loginUser: function (content) {

      this.store.createRecord('login', {
        user_name: get(content, 'emailAddr'),
        pwd: get(content, 'password'),
        company_id: 1
      }).save().then(function (res) {
        console.log(res);
        var responseBody = res._data.response;
        var responseCode = res._data.response_code;
        if (res._data.response_code !== 1) {
          this.get('controller').set('loginFail', true);
        } else {
          var user = {
            id: get(responseBody, 'user.id'),
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
      this.set('controller.loginShow', false);
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
