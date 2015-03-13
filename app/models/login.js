import DS from 'ember-data';

export default DS.Model.extend({
  user_name: DS.attr('string'),
  pwd: DS.attr('string'),
  company_id: DS.attr('number')
});
