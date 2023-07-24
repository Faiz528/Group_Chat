const send = document.getElementById('send');
const msg = document.getElementById('msg');
const user = document.getElementById('user');
const token = localStorage.getItem("token");
const names = localStorage.getItem("name");
const chatContainer = document.getElementById('chat-container'); 

user.textContent = "Welcome " + names;
console.log(token);
send.addEventListener('click', save);

async function refresh() {
  try {
    const response = await axios.get("http://localhost:3000/chat", {
      headers: {
        'Authorization': token
      }
    });

    const messagesFromServer = response.data.messages;
    console.log(messagesFromServer);
    chatContainer.innerHTML = ''; // Clear the chat container before displaying new messages

    for (const message of messagesFromServer) {
      displayMessage(message.Username, message.chat);
    }
  } catch (err) {
    console.log(err);
  }
}

// Call refresh initially when the page loads
refresh();

// Call refresh every 1 second (1000 milliseconds)
setInterval(refresh, 1000);

async function save(event) {
  var text = msg.value;
  try {
    const response = await axios.post("http://localhost:3000/chat", { "msg": text }, {
      headers: {
        'Authorization': token
      }
    });

    msg.value = "";
    // Handle the response from the server
    const message = response.data.m.chat;
    const username = response.data.m.Username; // Assuming the server responds with the chat message
    displayMessage(username, message); // Call a function to display the message on the screen

    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

function displayMessage(username, message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = username + ": " + message;
  chatContainer.appendChild(messageDiv);
}
