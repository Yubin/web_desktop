import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'login',
  classNames: ['login-badge'],

  shake: function () {
    if (this._state === 'inDOM' && this.get('controller.loginFail')) {
      var badge = this.$('.front .badge_container');
      badge.addClass('shake');
      Ember.run.later(function () {
        badge.removeClass('shake');
      }, 1000);
    } else {

    }
  }.observes('controller.loginFail'),

  onInputChange: function () {
    this.get('controller').set('loginFail', false);
  }.observes('emailAddr', 'password'),

  actions: {
    login: function () {
      this.get('controller').send('loginUser', {
        emailAddr: this.get('emailAddr') || 'yubin@gausian.com',
        password: this.get('password') || 'gausian'
      });
    },
    visitor: function () {
      this.get('controller').send('loginVisitor', {
        firstName: this.get('firstName'),
        lastName: this.get('lastName'),
        emailAddr: this.get('emailAddr'),
        invCode: this.get('invCode')
      });
    }
  }
});
