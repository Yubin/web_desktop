import Ember from 'ember';

var get = Ember.get;
export default Ember.Route.extend({

  model: function () {
    return {
      applist:[
{
  name: "Deliver Bid",
  imgName: "img/DeliverBid_logo.png",
  viewName: 'deliverBid',
  screen: 0,
  col: 0,
  row: 0
}, {
  name: "E-Inventory",
  imgName: "img/Einventory_logo.png",
  viewName: 'Einventory',
  screen: 0,
  col: 0,
  row: 2
}, {
  name: "Vender Match",
  imgName: "img/VenderMatch_logo.png",
  viewName: 'vendorMatch',
  screen: 0,
  col: 0,
  row: 1
}, {
  name: "Gausian Store",
  imgName: "img/icon_17.png",
  viewName: 'gausianStore',
  screen: 0,
  col: 0,
  row: 3
},
//
//       {name: "icon_11", imgName: "img/icon_11", screen: 0, col: 1, row: 2},
//       {name: "icon_12", imgName: "img/icon_12", screen: 0, col: 2, row: 2},
//       {name: "icon_13", imgName: "img/icon_13", screen: 0, col: 3, row: 2},
//       {name: "icon_14", imgName: "img/icon_14", screen: 0, col: 1, row: 3},
//       {name: "icon_15", imgName: "img/icon_15", screen: 0, col: 2, row: 3},
//       {name: "icon_16", imgName: "img/icon_16", screen: 0, col: 3, row: 3},
//       {name: "icon_13", imgName: "img/icon_13", screen: 0, col: 3, row: 4},
//       {name: "icon_14", imgName: "img/icon_14", screen: 0, col: 2, row: 4},
//       {name: "icon_15", imgName: "img/icon_15", screen: 0, col: 1, row: 4},
//       {name: "icon_16", imgName: "img/icon_16", screen: 0, col: 0, row: 4},
      // {name: "icon_21", imgName: "img/icon_1", screen: 1, col: 11, row: 0},
      // {name: "icon_22", imgName: "img/icon_2", screen: 1, col: 12, row: 0},
      // {name: "icon_23", imgName: "img/icon_3", screen: 1, col: 13, row: 0},
      // {name: "icon_24", imgName: "img/icon_4", screen: 1, col: 14, row: 0},
      // {name: "icon_25", imgName: "img/icon_5", screen: 1, col: 15, row: 1},
      // {name: "icon_27", imgName: "img/icon_7", screen: 1, col: 16, row: 1},
      // {name: "icon_28", imgName: "img/icon_8", screen: 1, col: 11, row: 1},
      // {name: "icon_29", imgName: "img/icon_9", screen: 1, col: 12, row: 2},
      // {name: "icon_211", imgName: "img/icon_11", screen: 1, col: 13, row: 2},
      // {name: "icon_212", imgName: "img/icon_12", screen: 1, col: 14, row: 2},
      // {name: "icon_213", imgName: "img/icon_13", screen: 1, col: 15, row: 2},
      // {name: "icon_214", imgName: "img/icon_14", screen: 1, col: 16, row: 2},
      // {name: "icon_215", imgName: "img/icon_15", screen: 1, col: 1, row: 3},
      {name: "icon_216", imgName: "img/icon_16.png", screen: 1, col: 3, row: 3},
      // {name: "icon_31", imgName: "img/icon_1", screen: 2, col: 0, row: 1},
      // {name: "icon_32", imgName: "img/icon_2", screen: 2, col: 1, row: 1},
      // {name: "icon_33", imgName: "img/icon_3", screen: 2, col: 2, row: 1},
      // {name: "icon_34", imgName: "img/icon_4", screen: 2, col: 3, row: 1},
      // {name: "icon_35", imgName: "img/icon_5", screen: 2, col: 0, row: 0},
      // {name: "icon_36", imgName: "img/icon_6", screen: 2, col: 1, row: 0},
      // {name: "icon_38", imgName: "img/icon_8", screen: 2, col: 3, row: 0},
      // {name: "icon_39", imgName: "img/icon_9", screen: 2, col: 0, row: 2},
      // {name: "icon_311", imgName: "img/icon_11", screen: 2, col: 1, row: 2},
      // {name: "icon_312", imgName: "img/icon_12", screen: 2, col: 2, row: 2},
      // {name: "icon_313", imgName: "img/icon_13", screen: 2, col: 3, row: 2},
      {name: "icon_317", imgName: "img/icon_17.png", screen: 2, col: 0, row: 3},
      ]
    };
  },

  setupController: function (controller, model) {
    this.controllerFor('applist').set('model', get(model, 'applist'));
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

      var screen = 0;
      var col = 0;
      var row = 0;

      var tmp = [];
      var tmp1 = [];

      var apps  = this.controllerFor('applist').get('model');
      for (screen = 0; screen < 3; screen ++) {
        tmp = apps.filter(function (app) {
          return get(app, 'screen') === screen;
        });
        if (tmp.length < 20) {
          break;
        }
      }
      for (col = 0; col < 4; col ++) {
        tmp1 = tmp.filter(function (app) {
          return get(app, 'col') === col;
        });
        if (tmp1.length < 5) {
          break;
        }
      }
      for (row = 0; row < 5; row ++) {
        var find = tmp1.any(function (app) {
          return get(app, 'row') === row;
        });
        if (!find) {
          break;
        }
      }

      this.controllerFor('applist').get('model').pushObject({
        name: get(content, 'name'),
        imgName: get(content, 'icon'),
        screen: screen,
        col: col,
        row: row
      });
    }
  }
});
