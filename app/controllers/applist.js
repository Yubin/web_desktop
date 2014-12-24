import Ember from 'ember';

var get = Ember.get;

export default Ember.ArrayController.extend({
  itemController: 'applist-item',
  screenNum: 3,

  appTouch: true,

  openApps: [],

  init: function () {
    this._super.apply(this, arguments);
    // this.setupOperator();
  },

  // setupOperator: function () {
  //   var i = 0;
  //   for (i = 0; i <= this.get('screenNum'); i++) {
  //     var name = 'screen_' + i;
  //     Ember.defineProperty(this, name, Ember.computed.filterBy('@this', 'screen', i));
  //   }
  // },

  actions: {
    showTrash: function (show) {
      this.set('appTouch', show);
    },
    openApp: function (item) { console.log('openApp');
      var name = get(item, 'name');

      var find = this.get('openApps').any(function (it) {
        return get(it, 'name') === name;
      });

      if (!find) {
        var viewType = 'app.' + get(item, 'viewName');
        var klass = this.container.lookupFactory('view:' + viewType);
        var instant = klass.create({
          content:    item,
          parentView: this,
          container:  this.container
        }).appendTo('body');
        this.get('openApps').pushObject({name: name, instant: instant});
      }
    },

    closeApp: function (item) {
      var name = get(item, 'name');
      var obj = this.get('openApps').filter(function (it) {
        return get(it, 'name') === name;
      });
      //
      var instant = get(obj[0], 'instant');
      if (instant) {
        this.get('openApps').removeObject(obj[0]);
        instant.destroy();
      }
    },

    addApp: function () { // TBD
      console.log('addApp');
    },

    deleteApp: function (/*item*/) { // TBD
      console.log('deleteApp');
    },

    moveImage: function (key) {

      console.log('moveImage' + key);
    },

  }
});
