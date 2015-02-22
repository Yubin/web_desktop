import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'login',
  classNames: ['login-badge'],
  actions: {
    login: function () {
      this.get('controller').send('loginUser', {
        emailAddr: this.get('emailAddr'),
        password: this.get('password')
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
