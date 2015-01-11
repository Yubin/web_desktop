import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'search-bar',
  classNames: ['search-bar'],
  query: '',
  inputWidth: function () {
    var query = this.get('query');

    if (Ember.isEmpty(query)) {
      this.$('input').width(80);
    } else {
      this.$('input').width(300);
    }
  }.observes('query')

});
