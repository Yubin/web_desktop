import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'header-dock-item',
  click: function () {
    this.get('content.instant').changeZindex();
    this.get('content.instant').showMinimizedApp();
  }
});
