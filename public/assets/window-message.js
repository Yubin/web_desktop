function receiveMessage(event) {
  var origin = event.origin;
  var data = event.data;

  if (origin.indexOf(location.host) < 0) {
    if (data.op === 'openApp') {
      var originAppId = data.originAppId;
      var targetAppId = data.targetAppId;
      var data = data.data;

      var iframeWin = document.getElementById(targetAppId).contentWindow;
      var payload = {
        op: 'openApp',
        value: data
      };
      iframeWin.postMessage(payload, 'http://localhost/user-app-template6/app/index.html');

    } else if (data.op === 'addLink') {
      var originAppId = data.originAppId;
      var viewId = Ember.$('.window.' + originAppId).attr('id')
      var view = Ember.View.views[viewId];
      if (viewId) {
        view.set('linkAppObject', {
          'appId': originAppId,
          'eventOrigin': origin
        });
        view._actions['flip'].apply(view);
      }
    }
  }

 }
 window.addEventListener("message", receiveMessage, false);
