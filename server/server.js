const path = require('path');
const express =  require('express');
const http = require('http');
const socketIO =  require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} =  require('./utils/validation');
const {Users} =  require('./utils/users');

// console.log(__dirname + '/../public');

var publicPath = path.join(__dirname,'/../public')
//console.log(test)
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users(); // to use all methods from user.js

const port = process.env.PORT || 3000; 

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.on('join',(params,callback)=>{
        if (!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room-name are required');
        }

        socket.join(params.room);
        //socket.leave('roomname')
        
        //io.emit -> io.to('roomname').emit
        //socket.broadcast.emit -> socket.broadcast.to('roomname').emit
        //socket.emit
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        
        socket.emit('newMessage',generateMessage('Admin','Welcome to chat app!!'));
        // socket.broadcast.emit('newMessage',generateMessage('Admin','New user has joined!!'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined!!`));

        callback();
    });

    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback();

        // socket.broadcast.emit('newMessage',{
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime().toString()
        // })
    });

    socket.on('createLocationMessage',(coords)=>{
        // io.emit('newMessage',generateMessage('Admin',`${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));

    });

    socket.on('disconnect',()=>{
        console.log('Disconnected from client');
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`));
        }
    });
});



server.listen(port,()=>{
    console.log(`Server is running on ${port} !!`);
})

