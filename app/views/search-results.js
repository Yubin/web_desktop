import Ember from 'ember';

export default Ember.CollectionView.extend({
  itemViewClass: 'search-results-item',
  tagName: 'ul',
  classNames: ['search-results']
});
