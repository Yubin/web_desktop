import DS from 'ember-data';

export default DS.Model.extend({
  user_id: DS.attr('number'),
  employee_id: DS.attr('number'),
  installed_app: DS.attr()
});
