const path = require('path');
const express =  require('express');
const http = require('http');
const socketIO =  require('socket.io');

const {generateMessage} = require('./utils/message');

// console.log(__dirname + '/../public');

var publicPath = path.join(__dirname,'/../public')
//console.log(test)
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000; 

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.on('disconnect',()=>{
        console.log('Disconnected from client');
    });

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app!!'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','New user has joined!!'));

    socket.on('createMessage',(message,ret)=>{
        console.log('createMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        ret('This is from server');

        // socket.broadcast.emit('newMessage',{
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime().toString()
        // })
    });
});



server.listen(port,()=>{
    console.log(`Server is running on ${port} !!`);
})

