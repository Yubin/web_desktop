import Ember from 'ember';

var Drag = Ember.Namespace.create({});

Drag.cancel = function (event) {
  event.preventDefault();
  return false;
};

Drag.Draggable = Ember.Mixin.create({
  attributeBindings: 'draggable',
  draggable: 'true',
  dragStart: function (evt) {
    /* firefox will only allow dragStart if it has data */
    evt.originalEvent.dataTransfer.setData('text/plain', 'DRAGGABLE');
  }
});

Drag.Droppable = Ember.Mixin.create({
  placeholder: null,
  dragEnter: Drag.cancel,
//  dragOver: Drag.cancel,
  drop: function (event) {
    event.preventDefault();
    return false;
  }
});

export default Drag;
