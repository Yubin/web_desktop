import Ember from 'ember';
import WindowMixin from '../mixins/window-view';
import FlipWindowMixin from '../mixins/flipwindow-view';

var get = Ember.get;
var set = Ember.get;
var arraysEqual = function (a, b) {
  if (a === b) {
    return true;
  } else if ( a === null || b === null || a.length !== b.length) {
    return false;
  } else {
    a.forEach(function (item) {
      if (b.indexOf(item) < 0) {
        return false;
      }
    });
    return true;
  }
};

export default Ember.View.extend(WindowMixin, FlipWindowMixin, {
  classNameBindings: ['content.name'],
  templateName: 'iframe',

  appLinkables: [],

  changeAppLinkables: function () {
    var app = this.get('content');
    var input_service = get(app, 'input_service');
    var idArray = input_service && input_service.split(',');
    var linked = get(app, 'linked');
    var appLinkables = this.get('appLinkables');
    appLinkables.clear();
    this.get('parentView.model').forEach(function (item) {
      var id = get(item, 'id');
      if (idArray.indexOf(id) > -1) { // in white list
        var hasLinked = false;
        if (linked && linked.indexOf(id) > -1) { // linked
          hasLinked = true;
        }
        appLinkables.pushObject(Ember.Object.create({
          id: get(item, 'id'),
          name: get(item, 'name'),
          icon: get(item, 'icon'),
          hasLinked: hasLinked
        }));
      }
    });
    this.$('iframe').load(function () {
      this.pushToIframe();
    }.bind(this));
  }.observes('content.input_service').on('didInsertElement'),

  pushToIframe: function () {
    var linkedApps = this.get('appLinkables').filterBy('hasLinked', true);
    var payload = {
      op: 'selectLink',
      targetApp: linkedApps
    };
    var url = this.$('iframe').attr('src');
    this.$('iframe')[0].contentWindow.postMessage(payload, url);
  },

  getLinkIds: function () {
    var linkedApps = this.get('appLinkables').filterBy('hasLinked', true);
    return linkedApps.mapBy('id');
  },

  unflipCallback: function () {
    var origin = this.get('content.linked');
    var ids = this.getLinkIds();

    if (!arraysEqual(origin, ids)) {
      this.set('content.linked', ids);
      this.get('parentView').syncAppLayout();
      this.pushToIframe();
    }
  }

});
