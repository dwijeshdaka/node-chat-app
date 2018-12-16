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

    socket.emit('newMessage',{
        from : 'Admin',
        text : 'Welcome to chat app!',
        createdAt : new Date().getTime()
    });

    socket.broadcast.emit('newMessage',{
        from : 'Admin',
        text : 'New user has joined!!',
        createdAt : new Date().getTime()
    })

    socket.on('createMessage',(message)=>{
        console.log('createMessage',message);
        io.emit('newMessage',{
            from: message.from,
            text : message.text,
            createdAt : new Date().getTime()
        })

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

