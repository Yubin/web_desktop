import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  templateName: 'search-bar',
  classNames: ['search-bar'],
  query: '',

  didInsertElement: function () {
    this.$('.search').on('click', function () {
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

  all: [
    {
      name: 'Check',
      rating: 5,
      category: 'Inventory Management',
      price: 4,
      freeDays: 30,
      icon: 'img/icon_1.png',
      installed: false
    }, {
      name: 'Aplus',
      rating: 5,
      category: 'Inventory Management',
      price: 8,
      freeDays: 30,
      icon: 'img/icon_1.png',
      installed: false
    }, {
      name: 'Docs',
      rating: 4,
      category: 'Inventory Management',
      price: 6,
      freeDays: 30,
      icon: 'img/icon_3.png',
      installed: false
    }, {
      name: 'Report',
      rating: 4,
      category: 'Inventory Management',
      price: 2,
      freeDays: 30,
      icon: 'img/icon_8.png',
      installed: false
    }, {
      name: 'Match',
      rating: 3,
      category: 'Inventory Management',
      price: 8,
      freeDays: 30,
      icon: 'img/icon_4.png',
      installed: false
    }, {
      name: 'Scan',
      rating: 5,
      category: 'Inventory Management',
      price: 4,
      freeDays: 30,
      icon: 'img/icon_5.png',
      installed: false
    }
  ],

  searchContent: function () {
    var array = [];
    var query = this.get('query');
    if (query) {
      query = query.toLowerCase();
      array = this.get('all').filter(function (item) {
        return get(item, 'name').toLowerCase().indexOf(query) !== -1 || get(item, 'category').toLowerCase() === query;
      });
    }
    return array;
  }.property('query'),

  keyUp: function (evt) {
    var query = this.get('query');
    if (evt.keyCode === 27) {
      if (query) {
        this.set('query', '');
      } else {
        this.$('.search').show();
        this.$('.overlay').hide();
      }
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
      var query = this.get('query');
      if (query) {
        this.set('query', '');
        this.$('.overlay input').focus();
      } else {
        this.$('.search').show();
        this.$('.overlay').hide();
      }
    }
  }

});
