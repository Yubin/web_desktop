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
  }.property('content.installed'),

  actions: {
    installApp: function () {
      this.set('content.installed', true);
      this.get('controller').send('installApp', this.get('content'));
    }
  }
});
