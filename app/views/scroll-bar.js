import Ember from 'ember';


export default Ember.View.extend({
  classNames: ['jspVerticalBar'],
  templateName: 'scroll-bar',

  trackStyle: function () {
    console.log('trackStyle');
    return 'height: %@px'.fmt(this.get('trackLen')||0);
  }.property('trackLen'),

  jspActive: function (evt) {
    var offsetY =  evt.originalEvent.offsetY;
    Ember.$('.overlay').on('mousemove', function (evt) { //TBD : better event handle
      Ember.run.debounce(function () {
        var offset = evt.originalEvent.clientY - offsetY - this.$().offset().top;
        var slideLen = this.get('trackLen') - this.get('handlerLen');
        if (offset > 0 && offset < slideLen) {
          console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + offsetY + ' = ' + offset);

          this.set('handlerTop', offset);
          var percent = offset / slideLen;
          this.get('parentView').scrollList(percent);
        }
      }.bind(this), 50);

    }.bind(this));

    Ember.$('.overlay').on('mouseup', function () {
      this.jspDeactive();

    }.bind(this));

  },

  jspDeactive: function () {
    Ember.$('.overlay').off('mousemove');
  },

  // mouseMove: function (evt) {
  //     if (this.get('active')) {
  //
  //       var offset = evt.originalEvent.clientY - this.get('offsetY') - 142;
  //       if (offset > 0 && offset < this.get('trackLen') - this.get('handlerLen')) {
  //         console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + this.get('offsetY') + ' = ' + offset);
  //
  //         this.set('handlerTop', offset);
  //       }
  //
  //       // console.log(offset);
  //     }
  // }

});
