const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")
const imageUploader = document.getElementById("file")//req
const imagePreview = document.getElementById("image-preview")
const deleteImagePreview = document.getElementById("delete-iamge-preview")
const messageInput = document.getElementById("msg")// req

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
chatForm.addEventListener("submit", async e => {
    e.preventDefault()
    const image = e.target.elements.file.files[0]
    msg = {
        image: null,
        text: null
    }
    if (image) {
        e.target.elements.file.value = ""
        imagePreview.src = "#"
        document.getElementById("image-preview-wrapper").hidden = true
        // Delete required from Message input

        // convert img to binary
        const bytes = await convertImageToBase64(image)
        msg.image = bytes


    }
    msg.text = e.target.elements.msg.value
    socket.emit("chatMessage", msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
    messageInput.required = true
    imageUploader.required = false
})

imageUploader.onchange = e => {
    document.getElementById("image-preview-wrapper").hidden = false;
    const [file] = imageUploader.files
    if (file) {
        messageInput.required = false
        imageUploader.required = true

        imagePreview.src = URL.createObjectURL(file)
    }
}

deleteImagePreview.onclick = e => {
    e.preventDefault()
    imageUploader.value = ""
    imagePreview.src = "#"
    document.getElementById("image-preview-wrapper").hidden = true
    messageInput.required = true
    imageUploader.required = false
}

appendMessage = (message) => {
    const div = document.createElement("div")
    div.classList.add("message")
    imageElement = ""
    if (message.image) {
        imageElement = `<img class="file-message" src='${message.image}' />`
    }

    div.innerHTML = (`<p class="meta"> ${message.username} <span>${message.time}</span></p >
    ${imageElement}
        <p class="text">
            ${message.messageText}
        </p>`)

    document.querySelector(".chat-messages").appendChild(div)
}

convertImageToBase64 = (image,) => {
    return new Promise(function (resolve, reject) {

        const reader = new FileReader();
        reader.onload = function () {
            const bytes = this.result;
            resolve(bytes);
        };
        reader.readAsDataURL(image);

    });


}
