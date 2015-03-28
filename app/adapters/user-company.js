import Adapter from './base';
import Serializer from '../serializers/user-company';
import Ember from 'ember';

var get = Ember.get;

export default Adapter.extend({
  serializer: Serializer.create(),

  createRecord: function (store, type, record) {
    var id = get(record, 'company_id');
    var requestStr = id;
    return this.ajax(this.buildURL(), 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'SetCompany'
    });
  }

});
