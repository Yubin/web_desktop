import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'search-results-item',
  classNames: ['search-results-item'],
  label: function () {
    if (this.get('content.installed')) {
      return 'Open';
    } else {
      return 'Get';
    }
  }.property('content.installed')
});
