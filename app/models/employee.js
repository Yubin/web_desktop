import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  user_id: DS.attr('number'),
  first: DS.attr('string'),
  last: DS.attr('string'),
  email: DS.attr('string'),
  type: DS.attr('string'),
  from: DS.attr('string'),
  report_to_id: DS.attr('number'),
  installed_app: DS.attr('string'),
  active: DS.attr('boolean'),

  didLoad: function(){
    setInterval(function() {
      this.reload();
    }.bind(this), 10*1000); //every 10s
  }
});
