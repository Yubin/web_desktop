function receiveMessage(event) {
  console.log(event.data);
  var data = event.data;
 }
 window.addEventListener("message", receiveMessage, false);
