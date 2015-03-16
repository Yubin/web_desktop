import Ember from 'ember';
import WindowMixin from '../../mixins/window-view';

export default Ember.View.extend(WindowMixin, {
  classNameBindings: ['content.app_id'],
  templateName: 'app/customer'
});
