// Setup Express and socket.io
var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

// Port the server listens to
var SERVER_PORT = 4444

// socket.io setup
io.on('connection', function (socket) {
  console.log('New connection. Socket id: \"' + socket.id + '\"')

    socket.once('disconnect', function(reason) {
      console.log('Socket \"' + socket.id + '\" closed.')
    })
})

// Start-up
http.listen(SERVER_PORT, function (err) {
  if (err) {
    console.log('Could not listen on port ' + SERVER_PORT)
  } else {
    console.log('Listening on port ' + SERVER_PORT + '...')
  }
})
