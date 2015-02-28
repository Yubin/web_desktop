import Ember from 'ember';

export default Ember.CollectionView.extend({
  tagName: 'ul',
  classNames: ['dock'],
  itemViewClass: 'header-dock-item'
})
