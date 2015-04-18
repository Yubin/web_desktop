import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.attr('string'),
  name: DS.attr('string'),
  last_version: DS.attr('string'),
  show_in_store: DS.attr('boolean'),
  pricing_by_month: DS.attr('number'),
  security_level: DS.attr('string'),
  certified: DS.attr('boolean'),
  default_install: DS.attr('boolean'),
  subscribed_services: DS.attr('string'),
  output_service: DS.attr('string'),
  input_service: DS.attr('string'),
  linked: DS.attr('string'),
  censorship_date: DS.attr('string'),
  path: DS.attr('string'),
  icon: DS.attr('string'),
  maximized: DS.attr('boolean'),
  has_header: DS.attr('boolean'),
  realizable: DS.attr('boolean'),
  width: DS.attr('number'),
  height: DS.attr('number'),
  screen: DS.attr('number', {defaultValue: 0}),
  row: DS.attr('number', {defaultValue: 0}),
  col: DS.attr('number', {defaultValue: 0})
});
