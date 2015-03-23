import Ember from 'ember';

export default Ember.Controller.extend({
  loginShow: false,
  appMoving: false,
  actions: {
    loginShow: function () {
      this.set('loginShow', true);
    },
    loginClose: function () {
      this.set('loginShow', false);
    }
  }
});
