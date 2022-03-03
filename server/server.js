const { instrument } = require('@socket.io/admin-ui')
const io = require('socket.io')(5000, {
  cors: {
    origin: ['http://localhost:8080', 'https://admin.socket.io'],
  },
})

// create socket namespace
const userIo = io.of('/user')
userIo.on('connection', (socket) => {
  console.log('connected to user namespace ' + socket.username)
})

// authenticate user middleware
userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token)
    next()
  } else {
    next(new Error('Please send token'))
  }
})

const getUsernameFromToken = (token) => {
  // check token from db
  return token
}

// make connection to socket
io.on('connection', (socket) => {
  console.log(socket.id)
  socket.on('send-message', (message, room) => {
    if (room === '') {
      socket.broadcast.emit('receive-message', message)
    } else {
      socket.to(room).emit('receive-message', message)
    }
  })
  socket.on('join-room', (room, cb) => {
    socket.join(room)
    cb(`Joined ${room}`)
  })
  socket.on('ping', (n) => console.log(n))
})

instrument(io, { auth: false })
