import Ember from 'ember';

var get = Ember.get;

export default Ember.View.extend({
  templateName: 'search-bar',
  classNames: ['search-bar'],
  query: '',

  // inputWidth: function () {
  //   var query = this.get('query');
  //
  //   if (Ember.isEmpty(query)) {
  //     this.$('input').width(80);
  //   } else {
  //     this.$('input').width(300);
  //   }
  // }.observes('query'),

  didInsertElement: function () {
    this.$('.search').on('click', function () {
      this.$('.overlay').show();
      this.$('.search').hide();
      this.$('.overlay input').focus();
    }.bind(this));

    this.$('.overlay').on('click', function () {
      this.$('.search').show();
      this.$('.overlay').hide();
    }.bind(this));
    this.$('.modal').on('click', function (evt) {
      evt.stopPropagation();
    });
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

  }

});
