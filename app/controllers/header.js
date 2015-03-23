import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['applist', 'application'],
  openApps: Ember.computed.alias('controllers.applist.openApps'),
  user: Ember.computed.alias('controllers.application.user'),
  dock: function () {
    return this.get('openApps').slice(0, 10);
  }.property('openApps.length'),

  subDock: function () {
    return this.get('openApps').slice(11);
  }.property('openApps.length')

});
