import Ember from 'ember';


export default Ember.View.extend({
  templateName: 'link-board',

  actions: {
    link: function (content) {
      content.set('hasLinked', true);
    },

    unlink: function (content) {
      content.set('hasLinked', false);
    }
  }

});
