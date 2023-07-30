const send = document.getElementById('send');
const token = localStorage.getItem("token")
const groupname = localStorage.getItem("groupname")
const chatBox = document.getElementById("chatBox")
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
  
     const participantsList = document.getElementById("participants");
      participantsList.innerHTML = ""; // Clear the previous participant list
  
      // Loop through the response data to add each participant to the list
      addParticipantsToDOM(response.data);
      participantsList.addEventListener('click', handleDeleteButtonClick);
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
  send.addEventListener('click', save);
  async function save(event) {
    var text = msg.value;
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
  function displayMessage(username, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = username + ": " + message;
    chatBox.appendChild(messageDiv);
  }
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