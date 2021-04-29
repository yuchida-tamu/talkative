const portalForm = document.querySelector('.portal-form');
portalForm.addEventListener('submit', event => {
  event.preventDefault();
  const roomname = event.target[0].value;
  createChatroom(roomname);
});

function createChatroom(roomname) {
  window.location = `/chatroom/${roomname}`;
}
