const socketIO = require('socket.io')
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socketIO(server, {
    cors:{
        origin:"http://localhost:3000"
    }
})

app.get("/api", (req, res) => {
    res.json({
        "users":["user1", "user2", "user3"]
    })
})

io.on('connection', (socket) => {
    console.log("A user has connected")
    socket.on('disconnect', (reason) => {
        console.log("User disconnected", reason)
    })
    socket.on("Join room", (room) => {
        console.log(socket.id, "Joined room ", room)
        socket.join(room)
    })
    socket.on("Opponent moved", ({room, grid}) => {
        socket.to(room).emit("Opp move", grid)
    })
    socket.on("Opponent won", (room) => {
        socket.to(room).emit("Opp won")
    })
    socket.on("Opponent lost", (room) => {
        socket.to(room).emit("Opp lost")
    })
})


server.listen(5000, () => {
    console.log("Server started on port 5000")
})