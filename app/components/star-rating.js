import Ember from 'ember';


export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['star-rating'],
  stars: function () {
    var rating = this.get('content') || 0;
    var array = new Array(rating);
    return array;
  }.property('content')

});
