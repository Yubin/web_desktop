import Adapter from './base';
import Serializer from '../serializers/base';
import Ember from 'ember';

var get = Ember.get;

export default Adapter.extend({
  serializer: Serializer.create(),

  createRecord: function (store, type, record) {
    var url = this.buildURL();
    var requestStr = 'GetUser';
    var serviceAppName = 'Login';

    return this.ajax(url, 'POST', {
      data: {requestString: requestStr},
      serviceAppName: serviceAppName
    });
  }

});
