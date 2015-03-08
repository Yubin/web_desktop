import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  templateName: 'search-bar',
  classNames: ['search-bar'],
  query: '',

  didInsertElement: function () {
    this.$('.search').on('click', function () {
      this.set('query', '');
      this.$('.overlay').show();
      this.$('.search').hide();
      this.$('.overlay input').focus();
    }.bind(this));

    // this.$('.overlay').on('click', function () {
    //   this.$('.search').show();
    //   this.$('.overlay').hide();
    //   this.$('.overlay').off('mousemove');
    // }.bind(this));
    // this.$('.modal').on('click', function (evt) {
    //   evt.stopPropagation();
    // });


    this.$('.modal').on('mousewheel', function(event) {
      var viewLen = this.$('.container').height() - 20; // 20 is padding
      var contentLen = this.get('controller.resultDivHeight');
      var top = parseInt(this.$('.container ul').css('top'), 10);
      var range = contentLen - viewLen;
      if (range > 0) {
        top = top + event.deltaY;
        top = Math.min(top, 0);
        top = Math.max(top, -range);
        this.$('.container ul').css({top: top + 'px'});
        var handlerTop = -top/range * this.get('handlerLen');
        this.set('handlerTop', handlerTop);
      }
    }.bind(this));
  },

  queryUpdate: function () {
    var query = this.get('query');

    if (query) {
      Ember.run.debounce(function () {
        this.get('controller').send('getSearchContent', query);
      }.bind(this), 500);
    } else {
      this.get('controller').set('searchContent', []);
    }
  }.observes('query'),

  keyUp: function (evt) {
    if (evt.keyCode === 27) {
      this.set('query', '');
      this.$('.search').show();
      this.$('.overlay').hide();
    }
  },

  updateHeight: function () {
    if (this.get('_state') === 'inDOM') {
      var viewLen = this.$('.container').height() - 20; // 20 is padding
      var contentLen = this.get('controller.resultDivHeight');
      var trackLen = viewLen;
      var handlerLen = trackLen * viewLen / contentLen;

      if (trackLen <= handlerLen) {
        this.setProperties({
          trackLen: 0,
          handlerLen: 0
        });
      } else {
        this.setProperties({
          trackLen: trackLen,
          handlerLen: handlerLen
        });
      }
    }
  }.observes('controller.resultDivHeight'),

  scrollList: function (percent) {
    var viewLen = this.$('.container').height() - 20; // 20 is padding
    var contentLen = this.get('controller.resultDivHeight');
    var top = (viewLen - contentLen) * percent;
    this.$('.container ul').css({top: top + 'px'});
  },

  actions: {
    cancel: function () {
        this.set('query', '');
        this.$('.search').show();
        this.$('.overlay').hide();
    }
  }

});
