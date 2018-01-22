var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PATH = require('path')

app.use(express.static(PATH.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    people[socket.id] = name;

    io.emit('update-people', people);
  });

  socket.on('talk-smack', (insult) => {
    io.emit('talk-smack', [socket.id, insult]);
  });

  socket.on('disconnect', () => {
    delete people[socket.id];

    io.emit('update-people', people);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});