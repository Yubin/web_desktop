import Adapter from './base';
import Serializer from '../serializers/app-info';
import Ember from 'ember';

var isEmpty = Ember.isEmpty;

export default Adapter.extend({
  serializer: Serializer.create(),

  findQuery: function (store, type, query) {
    var url = this.buildURL();
    // Get on id = 2 or id = 3
    var ids = query.ids;
    var onStr = '';
    if (!isEmpty(ids)) {
      if (ids.length && ids.length > 1) { // TBD Array
        onStr = ids.map(function(i){return 'id='+i;}).join(' or ');
      } else { // only one
        onStr = 'id=' + ids;
      }
    } else { // Get All!

    }

    onStr = onStr ? 'ON ' + onStr : '';
    console.log(onStr);

    var requestStr = 'GET ' + onStr;
    return this.ajax(url, 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'UserAppInfo'
    });
  }

});
