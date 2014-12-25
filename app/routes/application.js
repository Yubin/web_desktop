import Ember from 'ember';

var get = Ember.get;
export default Ember.Route.extend({

  model: function () {
    return {
      applist:[
{name: "Deliver Bid",
  imgName: "DeliverBid_logo",
  viewName: 'deliverBid',
  screen: 0, col: 0, row: 0},
{name: "E-Inventory",
  imgName: "Einventory_logo",
  viewName: 'Einventory',
  screen: 0, col: 0, row: 2},
{name: "Vender Match",
imgName: "VenderMatch_logo",
  viewName: 'vendorMatch',
screen: 0, col: 0, row: 1},
{name: "Gausian Store",
imgName: "icon_17",
viewName: 'gausianStore',
screen: 0, col: 0, row: 3},
      // {name: "icon_5", imgName: "icon_5", screen: 0, col: 0, row: 1},
      // {name: "icon_6", imgName: "icon_6", screen: 0, col: 1, row: 1},
      // {name: "icon_7", imgName: "icon_7", screen: 0, col: 2, row: 1},
      // {name: "icon_8", imgName: "icon_8", screen: 0, col: 3, row: 1},
      // {name: "icon_9", imgName: "icon_9", screen: 0, col: 0, row: 2},
      // {name: "icon_11", imgName: "icon_11", screen: 0, col: 1, row: 2},
      // {name: "icon_12", imgName: "icon_12", screen: 0, col: 2, row: 2},
      // {name: "icon_13", imgName: "icon_13", screen: 0, col: 3, row: 2},
      // {name: "icon_14", imgName: "icon_14", screen: 0, col: 1, row: 3},
      // {name: "icon_15", imgName: "icon_15", screen: 0, col: 2, row: 3},
      // {name: "icon_16", imgName: "icon_16", screen: 0, col: 3, row: 3},
      // {name: "icon_10", imgName: "icon_10", screen: 0, col: 0, row: 3},
      // {name: "icon_13", imgName: "icon_13", screen: 0, col: 3, row: 4},
      // {name: "icon_14", imgName: "icon_14", screen: 0, col: 2, row: 4},
      // {name: "icon_15", imgName: "icon_15", screen: 0, col: 1, row: 4},
      // {name: "icon_16", imgName: "icon_16", screen: 0, col: 0, row: 4},

      //
// {name: "icon_21", imgName: "icon_1", screen: 1, col: 11, row: 0},
// {name: "icon_22", imgName: "icon_2", screen: 1, col: 12, row: 0},
// {name: "icon_23", imgName: "icon_3", screen: 1, col: 13, row: 0},
// {name: "icon_24", imgName: "icon_4", screen: 1, col: 14, row: 0},
// {name: "icon_25", imgName: "icon_5", screen: 1, col: 15, row: 1},
// {name: "icon_27", imgName: "icon_7", screen: 1, col: 16, row: 1},
// {name: "icon_28", imgName: "icon_8", screen: 1, col: 11, row: 1},
// {name: "icon_29", imgName: "icon_9", screen: 1, col: 12, row: 2},
// {name: "icon_211", imgName: "icon_11", screen: 1, col: 13, row: 2},
// {name: "icon_212", imgName: "icon_12", screen: 1, col: 14, row: 2},
// {name: "icon_213", imgName: "icon_13", screen: 1, col: 15, row: 2},
//       {name: "icon_214", imgName: "icon_14", screen: 1, col: 16, row: 2},
      // {name: "icon_215", imgName: "icon_15", screen: 1, col: 1, row: 3},
      // {name: "icon_216", imgName: "icon_16", screen: 1, col: 3, row: 3},
      //
      // {name: "icon_31", imgName: "icon_1", screen: 2, col: 0, row: 1},
      // {name: "icon_32", imgName: "icon_2", screen: 2, col: 1, row: 1},
      // {name: "icon_33", imgName: "icon_3", screen: 2, col: 2, row: 1},
      // {name: "icon_34", imgName: "icon_4", screen: 2, col: 3, row: 1},
      // {name: "icon_35", imgName: "icon_5", screen: 2, col: 0, row: 0},
      // {name: "icon_36", imgName: "icon_6", screen: 2, col: 1, row: 0},
      // {name: "icon_38", imgName: "icon_8", screen: 2, col: 3, row: 0},
      // {name: "icon_39", imgName: "icon_9", screen: 2, col: 0, row: 2},
      // {name: "icon_311", imgName: "icon_11", screen: 2, col: 1, row: 2},
      // {name: "icon_312", imgName: "icon_12", screen: 2, col: 2, row: 2},
      // {name: "icon_313", imgName: "icon_13", screen: 2, col: 3, row: 2},
      // {name: "icon_317", imgName: "icon_17", screen: 2, col: 0, row: 3},
      ]
    };
  },

  setupController: function (controller, model) {
    this.controllerFor('applist').set('model', get(model, 'applist'));
  },

  renderTemplate: function() {
    this.render();
    this.render('header', {
      outlet: 'header',
      into: 'application'
    });
    this.render('applist', {
      outlet: 'applist',
      into: 'application'
    });
  }
});
