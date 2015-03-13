import Adapter from './base';
import Serializer from '../serializers/employee';
import Ember from 'ember';

var isEmpty = Ember.isEmpty;

export default Adapter.extend({
  serializer: Serializer.create(),

  find: function (store, type, id, record) {
    var url = this.buildURL();
    var requestStr = 'GET ON id=' + id;
    return this.ajax(url, 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'Employee'
    });
  }

});
