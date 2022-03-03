import { io } from 'socket.io-client'

const messageInput = document.getElementById('message-input')
const roomInput = document.getElementById('room-input')
const messageBox = document.getElementById('message-box')
const form = document.getElementById('form')
const joinRoomBtn = document.getElementById('room-button')

const socket = io('http://localhost:5000')
const userSocket = io('http://localhost:5000/user', { auth: { token: 'A' } })
socket.on('connect', () => {
  displayMessage(`You connected with id: ${socket.id}`)
})

userSocket.on('connect_error', (error) => {
  displayMessage(error)
})

socket.on('receive-message', (message) => {
  displayMessage(message)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = messageInput.value
  const room = roomInput.value

  if (messageInput.value === '') return
  displayMessage(message)
  socket.emit('send-message', message, room)

  messageInput.value = ''
})

const displayMessage = (message) => {
  const div = document.createElement('div')
  div.textContent = message
  messageBox.append(div)
}

joinRoomBtn.addEventListener('click', () => {
  const room = roomInput.value
  socket.emit('join-room', room, (message) => {
    displayMessage(message)
  })
})

let count = 0
setInterval(() => {
  // volatile: if can't send the message, delete all message completely
  socket.volatile.emit('ping', ++count)
}, 1000)

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input')) return
  if (e.key === 'c') socket.connect()
  if (e.key === 'd') socket.disconnect()
})
