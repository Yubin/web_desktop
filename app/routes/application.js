import Ember from 'ember';

var get = Ember.get;
export default Ember.Route.extend({

  beforeModel: function (params) {
    this.set('appinstall', get(params, 'queryParams.appinstall'))
  },
  model: function (params) {
    return {
      applist:[
// {
//   name: "Deliver Bid",
//   icon: "img/DeliverBid_logo.png",
//   viewName: 'deliverBid',
//   screen: 0,
//   col: 0,
//   row: 0
// }, {
//   name: "E-Inventory",
//   icon: "img/Einventory_logo.png",
//   viewName: 'Einventory',
//   screen: 0,
//   col: 0,
//   row: 2
// }, {
//   name: "Vender Match",
//   icon: "img/VenderMatch_logo.png",
//   viewName: 'vendorMatch',
//   screen: 0,
//   col: 0,
//   row: 1
// },
{
  name: "Gausian Store",
  icon: "img/icon_17.png",
  viewName: 'gausianStore',
  screen: 0,
  col: 0,
  row: 0
},
//
//       {name: "icon_11", icon: "img/icon_11", screen: 0, col: 1, row: 2},
//       {name: "icon_12", icon: "img/icon_12", screen: 0, col: 2, row: 2},
//       {name: "icon_13", icon: "img/icon_13", screen: 0, col: 3, row: 2},
//       {name: "icon_14", icon: "img/icon_14", screen: 0, col: 1, row: 3},
//       {name: "icon_15", icon: "img/icon_15", screen: 0, col: 2, row: 3},
//       {name: "icon_16", icon: "img/icon_16", screen: 0, col: 3, row: 3},
//       {name: "icon_13", icon: "img/icon_13", screen: 0, col: 3, row: 4},
//       {name: "icon_14", icon: "img/icon_14", screen: 0, col: 2, row: 4},
//       {name: "icon_15", icon: "img/icon_15", screen: 0, col: 1, row: 4},
//       {name: "icon_16", icon: "img/icon_16", screen: 0, col: 0, row: 4},
      // {name: "icon_21", icon: "img/icon_1", screen: 1, col: 11, row: 0},
      // {name: "icon_22", icon: "img/icon_2", screen: 1, col: 12, row: 0},
      // {name: "icon_23", icon: "img/icon_3", screen: 1, col: 13, row: 0},
      // {name: "icon_24", icon: "img/icon_4", screen: 1, col: 14, row: 0},
      // {name: "icon_25", icon: "img/icon_5", screen: 1, col: 15, row: 1},
      // {name: "icon_27", icon: "img/icon_7", screen: 1, col: 16, row: 1},
      // {name: "icon_28", icon: "img/icon_8", screen: 1, col: 11, row: 1},
      // {name: "icon_29", icon: "img/icon_9", screen: 1, col: 12, row: 2},
      // {name: "icon_211", icon: "img/icon_11", screen: 1, col: 13, row: 2},
      // {name: "icon_212", icon: "img/icon_12", screen: 1, col: 14, row: 2},
      // {name: "icon_213", icon: "img/icon_13", screen: 1, col: 15, row: 2},
      // {name: "icon_214", icon: "img/icon_14", screen: 1, col: 16, row: 2},
      // {name: "icon_215", icon: "img/icon_15", screen: 1, col: 1, row: 3},
      // {name: "icon_216", icon: "img/icon_16.png", screen: 1, col: 3, row: 3},
      // {name: "icon_31", icon: "img/icon_1", screen: 2, col: 0, row: 1},
      // {name: "icon_32", icon: "img/icon_2", screen: 2, col: 1, row: 1},
      // {name: "icon_33", icon: "img/icon_3", screen: 2, col: 2, row: 1},
      // {name: "icon_34", icon: "img/icon_4", screen: 2, col: 3, row: 1},
      // {name: "icon_35", icon: "img/icon_5", screen: 2, col: 0, row: 0},
      // {name: "icon_36", icon: "img/icon_6", screen: 2, col: 1, row: 0},
      // {name: "icon_38", icon: "img/icon_8", screen: 2, col: 3, row: 0},
      // {name: "icon_39", icon: "img/icon_9", screen: 2, col: 0, row: 2},
      // {name: "icon_311", icon: "img/icon_11", screen: 2, col: 1, row: 2},
      // {name: "icon_312", icon: "img/icon_12", screen: 2, col: 2, row: 2},
      // {name: "icon_313", icon: "img/icon_13", screen: 2, col: 3, row: 2},
      // {name: "icon_317", icon: "img/icon_17.png", screen: 2, col: 0, row: 3},
      ]
    };
  },

  setupController: function (controller, model) {
    var ctl = this.controllerFor('applist');
    ctl.set('model', get(model, 'applist'));
    ctl.set('appinstall', this.get('appinstall'));
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
    }
  }
});
