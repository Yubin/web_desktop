import Ember from 'ember';

export default Ember.Mixin.create({
  classNames: ['flipper'],

  linkAppObject: {},
  linkOriginApp: null,
  appLinkables: [],

  flipCallback: Ember.K,
  unflipCallback: Ember.K,
  actions: {
    flip: function () {
      this.$().addClass('fliped');
      this.flipCallback();
    },
    unflip: function () {
      this.$().removeClass('fliped');
      this.unflipCallback();
    }
  }

});
