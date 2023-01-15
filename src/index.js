const express = require('express')
const http = require('http')
const  socketio = require('socket.io')
const {adduser,removeuser,getuser,getusersinroom} = require('./users')

const endpoint =5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = express.Router();

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
router.get("/", (req, res) => {
  res.send( "Welcome to back end of chat app").status(200);
});
app.use(router);

//socket connection 
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = adduser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to group`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined..!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getusersinroom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getuser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeuser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getusersinroom(user.room)});
    }
  })
});;

server.listen(process.env.PORT,()=> console.log(`server runnin ${endpoint}`));