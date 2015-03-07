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
        console.error('serializer - app-info failed to parse response: ' +response);
      }
    }
    console.log(obj);
    return obj;
  }
  // serializeIntoHash: function (hash, type, record, options) {
  //   var oldHash = this.serialize(record, options);
  //   oldHash.seatId = parseInt(record.get('seatId.id'), 10);
  //   oldHash.id = parseInt(record.get('id'), 10);
  //
  //   Ember.merge(hash, oldHash);
  // }
});
