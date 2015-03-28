import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  extract: function (store, type, payload/*, id, requestType*/) {
    var response = Ember.get(payload, 'response');
    var code = Ember.get(payload, 'response_code');

    var obj = [];
    if (code === 1 && response) {
      try {
        obj = JSON.parse(response);
      } catch (e) {
        console.error('serializer - failed to parse response: ' +response);
      }
    }
    return obj;
  }
});
