const path = require('path')
const http = require('http')
const express = require('express')

const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

const io = require("socket.io")(server, {
    cors: {
          origin: "*",
        }

  })

  const users = {}

  io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
  })

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at port ${PORT}`))