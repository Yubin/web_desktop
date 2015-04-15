import Adapter from './base';
import Serializer from '../serializers/login';

export default Adapter.extend({
  serializer: Serializer.create(),

  createRecord: function (store, type, query) {
    var url = this.buildURL();
    return this.ajax(url, 'POST', {
      data: {requestString: 'logout'},
      serviceAppName: 'Login'
    });
  }

});
