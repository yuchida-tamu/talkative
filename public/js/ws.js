class Message {
  constructor(content, author) {
    this.content = content;
    this.author = author;
    this.html = createMessageElement(this.content);
  }
}

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  getUsernmae() {
    return this.username;
  }
  getEmail() {
    return this.email;
  }
  getId() {
    return this.id;
  }
}

const current_user = new User('testid1234', 'testuser', 'sample@example.com');

const socket = io(); //only if the frontend is in the same domain as the back.

socket.on('connect', () => {
  socket.send('Connect');
});

socket.on('message', data => {
  console.log(data);
  document.querySelector('#room-name').innerHTML = data;
});

socket.on('server_to_client', data => {
  console.log(data);
  const message = new Message(data.value, current_user.id);
  appendMessageToBoard(message.html);
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

function createMessageElement(text) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'message');
  const content = document.createElement('p');
  content.setAttribute('class', 'message__content');
  content.innerText = text;
  wrapper.appendChild(content);
  return wrapper;
}
