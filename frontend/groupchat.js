const send = document.getElementById('send');
const token = localStorage.getItem("token")
const groupname = localStorage.getItem("groupname")
const chatBox = document.getElementById("chatBox")
const h2 = document.getElementById("head")
const speak = document.getElementById("speak")
// ... Your existing code ...



document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("uploadButton");
  const fileInput = document.getElementById("fileInput");

  uploadButton.addEventListener("click", async () => {
    try {
      const formData = new FormData();
      formData.append("fileInput", fileInput.files[0]);

      const responses = await axios.post("http://localhost:3000/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(responses.data); // Handle the response from the server

      const response = await axios.post('http://localhost:3000/chats', {
      msg: fileInput.files[0].name, // Use the file name as the message content
      groupname: groupname,
    }, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response)
    const url = responses.data.url
    const message = response.data.m.chat;
    console.log(message)
    const username = response.data.m.Username; // Assuming the server responds with the chat message
    displayMessage(username, message,url);

    alert('File uploaded successfully and message sent!');
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
function displayMessage(username, message,url) {
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = username + ": " + parseMessageForLinks(message,url);
  chatBox.appendChild(messageDiv);
}

function parseMessageForLinks(message,url) {
  const linkRegex = /(\S+\.\w+)/g;
  return message.replace(linkRegex, '<a href="../uploads/$1"  >$1</a>');
}

//const upload = document.getElementById("upload")
const fileInput = document.getElementsByName('fileInput');
//const uploadButton = document.getElementById('uploadButton');

/*upload.addEventListener('submit',multi)
async function multi() {
  console.log()
  const file = fileInput.files[0];
  console.log(file)
  try {
    const signedUrlResponse = await axios.post('http://localhost:3000/uploads', {
      fileName: file.name,
      fileType: file.type,
    });
    console.log(signedUrlResponse)
    const signedUrl = signedUrlResponse.data.fileUrl;
    //fileInput=""
    const options = {
      headers: {
        'Content-Type': file.type,
      },
    };

   await axios.put(signedUrl, file, options);
     console.log(file.name)
    // File uploaded successfully, now send the message with the file URL to the backend
    const response = await axios.post('http://localhost:3000/chats', {
      msg: file.name, // Use the file name as the message content
      groupname: groupname,
    }, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response)

    const message = response.data.m.chat;
    console.log(message)
    const username = response.data.m.Username; // Assuming the server responds with the chat message
    displayMessage(username, message);

    alert('File uploaded successfully and message sent!');
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file. Please try again.');
  }
};*/

// ... Your existing code ...

/*async function sendMessage() {
    var messageInput = document.getElementById("message");
    var message = messageInput.value;
    messageInput.value = "";
    const response = await
    // You should handle sending the message to the server here.
    // For demonstration purposes, we'll just append the message to the chat box.
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += "<p>You: " + message + "</p>";
  }*/
  async function fetchParticipants() {
    try {

      const response = await axios.get("http://localhost:3000/getparticipants", {
  params: {
    groupname: groupname
  },
  headers: {
    Authorization: token
  }
});
      console.log(response)
     h2.innerHTML= groupname
     const participantsList = document.getElementById("participants");
      participantsList.innerHTML = ""; // Clear the previous participant list
  
      // Loop through the response data to add each participant to the list
      addParticipantsToDOM(response.data);
      participantsList.addEventListener('click', handleDeleteButtonClick);
      chatBox.innerHTML=""
      const msg = await axios.get("http://localhost:3000/chats", { params: { "groupname": groupname } },)
      console.log(msg)
      //const message = msg.data.chat
      //const username = msg.data.Username
      for (const message of msg.data) {
        displayMessage(message.Username, message.chat);
      }
    } catch (err) {
      console.log(err);
    }
  }
  //setInterval(fetchParticipants, 1000);
  
  // Call the fetchParticipants function when the page loads or refreshes
  window.addEventListener("load", fetchParticipants);
 async function addParticipant() {
    var participantInput = document.getElementById("participantName");
    var participantName = participantInput.value;
    participantInput.value = "";
    console.log(token)
    try{
    const response = await axios.post("http://localhost:3000/addmember",{"member":participantName,"groupname":groupname})
    var participantsList = document.getElementById("participants");
    var newParticipant = document.createElement("li");
    newParticipant.innerText = response.data.name;
    const deleteButton = document.createElement("button");
      deleteButton.className = "button-34";
      deleteButton.id = "delete";
      deleteButton.innerText = "R";
    participantsList.appendChild(newParticipant);
    participantsList.appendChild(deleteButton);
    }
    catch(err){
        alert(err.response.data.error)
    }
  }
  function addParticipantsToDOM(participants) {
    const participantsList = document.getElementById("participants");
    participantsList.innerHTML = ""; // Clear the previous participant list
  
    participants.forEach((participant) => {
      const newParticipant = document.createElement("li");
      const deleteButton = document.createElement("button");
      deleteButton.className = "button-34";
      deleteButton.id = "delete";
      deleteButton.innerText = "R";
      newParticipant.innerText = participant.Username;
  
      participantsList.appendChild(newParticipant);
      participantsList.appendChild(deleteButton);
    });
  }
  speak.addEventListener('submit', save);
  async function save(event) {
    event.preventDefault();
    var text= event.target.msg.value
    //var text = msg.value;
    try {
      const response = await axios.post("http://localhost:3000/chats", { "msg": text ,"groupname":groupname},{
        headers: {
          'Authorization': token
        }
      });
  
      msg.value = "";
      console.log(response)
      // Handle the response from the server
      const message = response.data.m.chat;
      console.log(message)
      const username = response.data.m.Username; // Assuming the server responds with the chat message
      displayMessage(username, message); // Call a function to display the message on the screen
  
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  /*function displayMessage(username, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = username + ": " + message;
    chatBox.appendChild(messageDiv);
  }*/
  function handleDeleteButtonClick(event) {
    const target = event.target;
    if (target && target.id === "delete") {
      // Delete button clicked, get the participant name to delete
      const participantName = target.previousSibling.innerText;
      // Call a function to delete the participant with the given name
      deleteParticipant(participantName);
      fetchParticipants()
    }
  }
  
  async function deleteParticipant(participantName) {
    try {
      const response = await axios.post("http://localhost:3000/deleteparticipant", { "member": participantName, "groupname": groupname },{
        headers: {
          'Authorization': token
        }
      });
      // If the backend responds with success, you can update the participant list here
      console.log(response);
      // Fetch the updated participants after deletion
      fetchParticipants();
    } catch (err) {
      alert(err.response.data.error);
    }
  }
  function displaySocketIOMessage(username, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = username + ': ' + message;
    chatBox.appendChild(messageDiv);
  }
  
  // Handle Socket.IO messages
 /* socket.on('message', (data) => {
    const username = data.Username;
    const message = data.chat;
    displaySocketIOMessage(username, message);
  });
  
  // Function to send message using Socket.IO
  async function sendMessageSocketIO() {
    var messageInput = document.getElementById('message');
    var message = messageInput.value;
    messageInput.value = '';
  
    const payload = {
      msg: message,
      groupname: groupname,
      Authorization: token,
    };
  
    socket.emit('message', payload);
  }*/
  
  // Update 'send' button click event to use Socket.IO
  //send.addEventListener('click', sendMessageSocketIO);