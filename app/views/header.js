import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['head'],
  classNameBindings: [':fadeIn-100ms', ':animated', 'show:fadeIn:fadeOut'],
  templateName: 'header',
  width_dock_icon: 52,
  width_dock_corner: 25,
  width_sync: 0,
  showProfile: false,
  showProfile_comp: false,
  show: Ember.computed.alias('controller.headerShowing'),
  companyName: function () {
    var name = 'Company Name';
    var companies = this.get('controller.user.companies');
    var id = this.get('controller.user.current_compony_id');
    if (!Ember.isEmpty(companies) && !Ember.isEmpty(id)) {
      var obj = companies.findBy('id', parseInt(id));
      name = Ember.get(obj, 'name');
    }

    return name;
  }.property('controller.user.companies.[]', 'controller.user.current_compony_id'),

  adjustSize: function () {
    var total_dock = this.get('content.dock.length');
    var offset = total_dock ? total_dock * this.get('width_dock_icon') + 2 * this.get('width_dock_corner') : 0;
    var width = (Ember.$( window ).width() - offset - this.get('width_sync')) /2 ;
    if (this.get('_state') === "inDOM") {
      this.$('.left').width(width);
      this.$('.right').width(width);
    }
  }.observes('content.dock.length'),

  init: function() {
    this._super();
    Ember.$(window).bind('resize', function () {
      this.adjustSize();
    }.bind(this));
    Ember.$(document).on('click.' + this.elementId, Ember.run.bind(this, function (event) {
      if(this.get('showProfile') || this.get('showProfile_comp')) {
        var $target = Ember.$(event.target);
        if(this.$().find($target).length === 0) {
          this.set('showProfile', false);
          this.set('showProfile_comp', false);
        }
      }
    }));
  },
  didInsertElement: function () {
    this.adjustSize();
  },
  willDestroyElement: function() {
		Ember.$(document).off('click.' + this.elementId);
	},
  actions: {
    showProfile: function () {
      this.toggleProperty('showProfile');
    },
    showProfile_comp: function () {
      this.toggleProperty('showProfile_comp');
    },
    changeCompany: function (id) {
      this.get('controller').send('changeCompany', id);
      this.toggleProperty('showProfile');
    }
  }

});
