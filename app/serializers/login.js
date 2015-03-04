import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({


  extract: function (store, type, payload/*, id, requestType*/) {
    var response = Ember.get(payload, 'response');

    var obj = {};
    if (response) {
      obj = JSON.parse(response);
    }
    Ember.set(payload, 'response', obj);
    return payload;
  }
  // serializeIntoHash: function (hash, type, record, options) {
  //   var oldHash = this.serialize(record, options);
  //   oldHash.seatId = parseInt(record.get('seatId.id'), 10);
  //   oldHash.id = parseInt(record.get('id'), 10);
  //
  //   Ember.merge(hash, oldHash);
  // }
});
