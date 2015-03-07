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

  all: [
    {
      name: 'Customer',
      rating: 5,
      category: 'Base',
      price: 4,
      freeDays: 30,
      icon: 'http://asa.static.gausian.com/user_app/Customers/icon.png',
      viewName: 'customer',
      installed: false,
      url: 'http://localhost/user-app-template5/app/'
    },
    {
      name: 'Pixlr',
      rating: 5,
      category: 'Creative',
      price: 4,
      freeDays: 15,
      icon: 'img/pixlr.png',
      viewName: 'customer',
      installed: false,
      url: 'http://pixlr.com/editor/?loc=zh-cn'
    },
    {
      name: 'HipChat',
      rating: 5,
      category: 'Collaboration',
      price: 4,
      freeDays: 15,
      icon: 'img/hipchat.jpg',
      viewName: 'customer',
      installed: false,
      url: 'https://gausian.hipchat.com/chat'
    },
    {
      name: 'Test',
      rating: 5,
      category: 'Inventory Management',
      price: 4,
      freeDays: 30,
      icon: 'http://asa.static.gausian.com/user_app/Customers/icon.png',
      viewName: 'customer',
      url: 'http://127.0.0.1/',
      installed: false
    }
  ],

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
