import Ember from 'ember';

export default Ember.Controller.extend({
  resultDivHeight: 0,
  actions: {
    getSearchContent: function (query) {
      this.store.findQuery('app-info', {ids: []}).then(function (res) {
        var apps = res.get('content').map(function(u){return u._data;});
        var searchResults = [];
        if (apps) {
          searchResults = apps.filter(function (app) {
            return Ember.get(app, 'app_name').toLowerCase().indexOf(query.toLowerCase()) >=0;
          });
        }
        this.set('searchContent', searchResults);
      }.bind(this));
    }
  }
});
