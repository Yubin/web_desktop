import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['applist'],
  openApps: Ember.computed.alias('controllers.applist.openApps'),
  dock: function () {
    return this.get('openApps').slice(0, 10);
  }.property('openApps.length'),

  sendDock: function () {
    return this.get('openApps').slice(11);
  }.property('openApps.length')


});
