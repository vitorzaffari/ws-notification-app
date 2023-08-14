const chatForm = document.querySelector("#chat-form");
const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit(`joinRoom`, {username, room})

socket.on("message", (msg) => {
  displayMessage(msg);
});

socket.on('roomUsers', ({room, users}) => {
    const roomName = document.querySelector('.room-name')
    const usersList = document.getElementById('users-list');
    roomName.innerText = room
    usersList.innerHTML = `${users.map(user =>`<p>${user.username}</p>`).join('')}`
})

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function displayMessage(msg) {
  const { username, text, time } = msg;
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <div class="msg-header">
        <p class="user">${username}</p>
        <p class="time">${time}</p>
    </div>
    <p class="text">${text}</p>`;
  const display = document.getElementById("chat-display");
  display.appendChild(div);

  //scroll bottom
  display.scrollTop = display.scrollHeight;
}
