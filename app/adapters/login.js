import DS from 'ember-data';
import Serializer from '../serializers/login';

export default DS.RESTAdapter.extend({
  serializer: Serializer.create(),
  buildURL: function (/*type, id*/) {
    return 'http://asa.gausian.com/';
  },

  findQuery: function (store, type, query) {
    var url = this.buildURL();
    return this.ajax(url, 'POST', { data: query });
  },


  ajax: function (rawUrl, type, rawHash) {
    var adapter = this, data;

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var hash = {},
        url = rawUrl;
      hash.type = type;
      hash.dataType = 'json';

      hash.context = adapter;
      hash.data = 'user_app_id=app_id&service_app_name=Login&request_string=' +
        JSON.stringify(rawHash.data.login);

      hash.beforeSend = function (xhr) {
        if (adapter.headers !== undefined) {
          var headers = adapter.headers;
          Ember.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
          });
        }
      };

      hash.success = function (json/*, textStatus, jqXHR*/) {
        Ember.run(null, resolve, json);
      };

      hash.error = function (jqXHR/*, textStatus, errorThrown*/) {
        Ember.run(null, reject, adapter.ajaxError(jqXHR, surpressError));
      };

      hash.url = url.toLowerCase();
      // hash.crossDomain = true;

      // CORS: This enables cookies to be sent with the request
      // hash.xhrFields = { withCredentials: true };

      Ember.$.ajax(hash);
    }.bind(this), 'DS: AudienceAdapter#ajax ' + type + ' to ' + rawUrl);
  }

});
