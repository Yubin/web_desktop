import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function () {
    var self = this;
    this.$('.trash').droppable({
      hoverClass: "ui-state-hover",
      accept: ".appicon",
      drop: function (event, ui) {
        var id = Ember.$(ui.draggable[0]).attr('id');
        var view = Ember.View.views[id];
        if (view) {
          self.sendAction('action', view.get('content'));
        }
      }
    });
  },

});
