// //mesage class
// class Message extends HTMLElement {
//   constructor() {
//     super();
//     const wrapper = document.createElement('div');
//     wrapper.setAttribute('class', 'message'); //set the classname as message
//     const content = document.createElement('p').innerText(text); //set the inner text of <p> and attach it to the wrapper
//     wrapper.appendChild(content);
//   }
// }

const socket = io(); //only if the frontend is in the same domain as the back.

socket.on('connect', () => {
  socket.send('Connect');
});

socket.on('message', data => {
  console.log(data);
});

socket.on('server_to_client', data => {
  const message = document.createElement('div');
  message.innerText = data;
  appendMessageToBoard(message);
});

const messageBoard = document.querySelector('.message-board');
//get html form element whose classname is chat-form
const chatForm = document.querySelector('.chat-form');
//attach eventListner for when the form is submitted
chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = event.target[0].value;
  sendMessage(text);
});

//send text message
function sendMessage(text) {
  //grab the value from the text input
  socket.emit('client_to_server', { value: text });
}

function appendMessageToBoard(messageElement) {
  messageBoard.appendChild(messageElement);
}
