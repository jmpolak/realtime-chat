const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
// Join room
socket.emit("joinRoom", { username, room })

// Get room and users
socket.on("roomInfo", ({ room, users }) => {
    roomName.innerHTML = room
    userList.innerHTML = `
${users.map(user => `<li>${user.username}</li>`).join("")}
`
})

// Listen to new message
socket.on("message", message => {
    appendMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight
})

// submit message
chatForm.addEventListener("submit", e => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit("chatMessage", msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})


appendMessage = (message) => {
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = (`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.messageText}
    </p>`)

    document.querySelector(".chat-messages").appendChild(div)
}
