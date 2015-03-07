import Adapter from './base';
import Serializer from '../serializers/app-info';

export default Adapter.extend({
  serializer: Serializer.create(),

  findQuery: function (store, type, query) {
    var url = this.buildURL();
    // Get on id = 2 or id = 3
    var ids = query.ids;
    var onStr = '';
    if (ids) {
      if (ids.length) { // TBD Array

      } else { // only one
        onStr = 'id=' + ids.id;
      }
    } else { // Get All!

    }

    onStr = onStr ? 'ON ' + onStr : '';
    console.log(onStr);

    var requestStr = 'GET ' + onStr;
    return this.ajax(url, 'POST', {
      data: {requestString: requestStr},
      serviceAppName: 'UserAppInfo',
      userAppId: 'Fl2GDgDECXcbmJsBAJVayUhuLwkAAAA'
    });
  }

});
