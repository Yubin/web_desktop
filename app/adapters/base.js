import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({

  buildURL: function (/*type, id*/) {
    return 'http://asa.gausian.com/';
  },

  ajax: function (rawUrl, type, rawHash) {
    var adapter = this;
    var userAppId = rawHash.userAppId || 'Fl2GDgDECXcbmJsBAJVayUhuLwkAAAA;'; // app_id
    var serviceAppName = rawHash.serviceAppName ;// Login
    var requestString = rawHash.data.requestString;

    return new Ember.RSVP.Promise(function (resolve, reject) {
      var hash = {},
        url = rawUrl;
      hash.type = type;
      hash.dataType = 'json';
      hash.context = adapter;
      hash.data = 'user_app_id=%@&service_app_name=%@&request_string=%@'
        .fmt(userAppId, serviceAppName, requestString);

      hash.beforeSend = function (xhr) {
        if (adapter.headers !== undefined) {
          var headers = adapter.headers;
          Ember.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key]);
          });
        }
      };

      hash.success = function (json, textStatus, jqXHR) {
        Ember.run(null, resolve, json);
      };

      hash.error = function (jqXHR/*, textStatus, errorThrown*/) {
        Ember.run(null, reject, adapter.ajaxError(jqXHR, function (hash) {
          console.error('ajax error');
          console.log(hash);
        }));
      };

      hash.url = url.toLowerCase();
      hash.crossDomain = true;

      // CORS: This enables cookies to be sent with the request
      hash.xhrFields = { withCredentials: true };

      Ember.$.ajax(hash);
    }.bind(this), 'DS: AudienceAdapter#ajax ' + type + ' to ' + rawUrl);
  }

});
