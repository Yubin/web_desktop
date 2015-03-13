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

    } else {
      var payload = {
       op: 'selectLink',
       targetApp: {
         id: 'Quotes',
         name: 'Quotes',
         icon: '123123/icon.png'
       }
     };
     event.source.postMessage(payload, origin);

    }
  }

 }
 window.addEventListener("message", receiveMessage, false);
