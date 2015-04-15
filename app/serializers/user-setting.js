import Base from './base';
import Ember from 'ember';
export default Base.extend({

  extract: function (store, type, payload/*, id, requestType*/) {
    var array = this._super(store, type, payload);
    var installed_app = [];
    var obj = array[0];
    try {
      var str = Ember.get(obj, 'installed_app');
      if (str) {
        installed_app = JSON.parse(str);
        Ember.set(obj, 'installed_app', installed_app);
      }
    } catch (e) {
      console.error(e);
    }
    return obj;
  }
});
