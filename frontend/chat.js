const send = document.getElementById('send');
const msg = document.getElementById('msg');
const user = document.getElementById('user');
const token = localStorage.getItem("token");
const names = localStorage.getItem("name");
const chatContainer = document.getElementById('chat-container');
const openPopupButton = document.getElementById("openPopupButton");
const closePopupButton = document.getElementById("closePopupButton");
const popupContainer = document.getElementById("popupContainer");
const saveButton = document.getElementById("saveButton");
const groupContainer = document.getElementById("groupContainer")


openPopupButton.addEventListener("click", () => {
    popupContainer.style.display = "block";
});

closePopupButton.addEventListener("click", () => {
    popupContainer.style.display = "none";
});

let chatMessages = []; // Variable to store chat messages locally

user.textContent = "Welcome " + names;
console.log(token);
//send.addEventListener('click', save);
async function refreshChat() {
  try {
    /*const response = await axios.get("http://localhost:3000/chat", {
      headers: {
        'Authorization': token
      }
    });*/
    const group = await axios.get("http://localhost:3000/newgroup", {
      headers: {
        'Authorization': token
      }
    })
    console.log(group.data)
    for (const groups of group.data) {
      console.log(groups)
      displayGroup(groups);
    }
    
    /*const messagesFromServer = response.data.messages;
    console.log(messagesFromServer);
    chatContainer.innerHTML = ''; // Clear the chat container before displaying new messages

    for (const message of messagesFromServer) {
      displayMessage(message.Username, message.chat);
    }*/
  } catch (err) {
    console.log(err);
  }
}

// Call refreshChat initially when the page loads
const refresh =window.addEventListener('load', refreshChat);

// Call refreshChat every 1 second (1000 milliseconds)
//setInterval(refresh(), 1000);


function getLastMessageTimestamp() {
  // Get the timestamp of the last fetched message from local storage
  const lastMessage = chatMessages[chatMessages.length - 1];
  return lastMessage ? lastMessage.timestamp : null;
}

function saveChatToLocalStorage() {
  // Save the chat messages in local storage
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
}

function loadChatFromLocalStorage() {
  // Load chat messages from local storage
  const savedChatMessages = localStorage.getItem("chatMessages");
  chatMessages = savedChatMessages ? JSON.parse(savedChatMessages) : [];
}

// Load chat messages from local storage on page load
loadChatFromLocalStorage();

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
function displayGroup(groups) {
  const groupDiv = document.createElement('li');

  groupDiv.textContent = groups.GroupName;
  groupDiv.addEventListener("click",()=>{
    localStorage.setItem("groupname",groups.GroupName)
    window.location.href='../HTML/groupchat.html'
  })
  groupContainer.appendChild(groupDiv);
}

saveButton.addEventListener("click",async () => {
  const name = nameInput.value;

  const response = await axios.post("http://localhost:3000/newgroup",{"name":name},{headers:{"Authorization":token}})
  console.log(response)
  if (name.trim() !== '') {
      createGroup(name);
      popupContainer.style.display = "none";
      nameInput.value = ""; // Clear the input field after saving.
  } else {
      alert("Please enter a valid name.");
  }
});

function createGroup(name) {
  const group = document.createElement("button");

  group.className = "group";
  group.textContent = name;
  groupContainer.appendChild(group);
}
