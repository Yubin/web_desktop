import Ember from 'ember';
import DragDrop from '../mixins/drag-n-drop-view';


export default Ember.Component.extend(DragDrop.Droppable,{

  drop: function () {
    console.log('drop');
  }

});
