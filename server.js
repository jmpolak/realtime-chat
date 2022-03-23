const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const { joinUser, getCurrentUser, disconnectUser, getRoomUsers } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))
const botName = "ChatBot"


io.on("connection", (socket) => {

    // on joining a room
    socket.on("joinRoom", ({ username, room }) => {
        const user = joinUser(socket.id, username, room)
        socket.join(user.room)

        socket.emit("message", formatMessage(botName, "Welcome to the Chat!"))
        // broadcast when new user connect to other users
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} joined the room!`))

        io.to(user.room).emit("roomInfo", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen to chat message
    socket.on("chatMessage", message => {
        const user = getCurrentUser(socket.id)
        socket.to(user.room).emit("message", formatMessage(user.username, message.text, message.image))
    })





    // on disconnection
    socket.on("disconnect", () => {
        // send message to all users
        const user = disconnectUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} left the room!`))

            io.to(user.room).emit("roomInfo", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})