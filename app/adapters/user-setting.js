import Adapter from './base';
import Serializer from '../serializers/user-setting';
import Ember from 'ember';

var isEmpty = Ember.isEmpty;
var get = Ember.get;

export default Adapter.extend({
  serializer: Serializer.create(),

  find: function (store, type, id) {
    // Get on id = 2 or id = 3
    var onStr = 'ON employee_id=' + id;
    var requestStr = 'GET ' + onStr;
    return this.ajax(this.buildURL(), 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'UserSetting'
    });
  },

  updateRecord: function (store, type, record) {
    var id = get(record, 'id');
    var installed_app = JSON.stringify(get(record, 'installed_app'));
    var requestStr = 'SET installed_app=%@ ON employee_id=%@'.fmt(JSON.stringify(installed_app), id);
    return this.ajax(this.buildURL(), 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'UserSetting'
    });
},

});
