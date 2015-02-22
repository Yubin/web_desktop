import DS from 'ember-data';

export default DS.Model.extend({
  user_name: DS.attr('string'),
  pwd: DS.attr('string')
});
