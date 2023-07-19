const send = document.getElementById('send');
const msg = document.getElementById('msg');
const user = document.getElementById('user');
const token = localStorage.getItem("token");
const names = localStorage.getItem("name")
const chatContainer = document.getElementById('chat-container'); // Assuming you have a div for chat display
user.textContent="Welcome "+names
console.log(token);
send.addEventListener('click', save);

window.addEventListener('load', async () => {
    try {
      const response = await axios.get("http://localhost:3000/chat", {
        headers: {
          'Authorization': token
        }
      });
  
      const messagesFromServer = response.data.messages;
      console.log(messagesFromServer)
      for (const message of messagesFromServer) {

        displayMessage(message.Username, message.chat);
        //saveMessageLocally(message);
      }
    } catch (err) {
      console.log(err);
    }
  });

async function save(event) {
  var text = msg.value;
  try {
    const response = await axios.post("http://localhost:3000/chat", { "msg": text } ,{
      headers: {
        'Authorization': token
      }
    });


    // Handle the response from the server
    const message = response.data.m.chat;
    const user = response.data.m.Username // Assuming the server responds with the chat message
    displayMessage(user,message); // Call a function to display the message on the screen

    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

function displayMessage(user,message) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent =user+": " +message;
  chatContainer.appendChild(messageDiv);
}
