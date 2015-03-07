import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.attr('string'),
  app_name: DS.attr('string'),
  last_version: DS.attr('string'),
  show_in_store: DS.attr('boolean'),
  pricing_by_month: DS.attr('number'),
  security_level: DS.attr('string'),
  certified: DS.attr('boolean'),
  default_install: DS.attr('boolean'),
  subscribed_services: DS.attr('string'),
  output_service_id: DS.attr('string'),
  input_service_id: DS.attr('string'),
  censorship_date: DS.attr('string'),
  path: DS.attr('string'),
  icon: DS.attr('string')
});
