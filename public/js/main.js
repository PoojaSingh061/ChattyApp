const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("contacts");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const li = document.createElement("li");
  if (message.username == username) li.classList.add("sent");
  else li.classList.add("replies");
  li.innerHTML = `<p> <span class="meta-data">${message.username} <span>${message.time}</span></span><br>
      ${message.text}
    </p>`;
  document.querySelector(".messages").appendChild(li);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = `Room Name : ${room}`;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
      ${users
        .map(
          (user) => `<li class="contact">
      <div class="wrap">
          <div class="meta">
              <p class="name"><i class="fa fa-user" aria-hidden="true"></i>
              ${user.username}</p>
          </div>
      </div>
  </li>`
        )
        .join("")}
    `;
}
