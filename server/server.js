const path = require('path');
const express =  require('express');
const http = require('http');
const socketIO =  require('socket.io');

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

    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);
    });

    socket.emit('newMessage',{
        from : 'dwijesh',
        text : 'Message send test',
        createdAt : 1147
    });
});



server.listen(port,()=>{
    console.log(`Server is running on ${port} !!`);
})

