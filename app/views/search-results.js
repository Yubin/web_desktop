import Ember from 'ember';

export default Ember.CollectionView.extend({
  itemViewClass: 'search-results-item',
  tagName: 'ul',
  classNames: ['search-results'],
  onChildViewsChanged : function( obj, key ){
    var length = this.get( 'childViews.length' );
    if( length > 0 ){
      Ember.run.scheduleOnce( 'afterRender', this, 'childViewsDidRender' );
    }
  }.observes('childViews'),

  childViewsDidRender : function(){
    this.get('controller').set('resultDivHeight', this.$().height());
  }
});
