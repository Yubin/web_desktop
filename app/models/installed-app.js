import DS from 'ember-data';

export default DS.Model.extend({
  link: DS.attr('string'),
  location: DS.attr('string')
});
