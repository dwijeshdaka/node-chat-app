var socket = io();
socket.on('connect',function(){
    console.log('connected to server');
});

socket.on('disconnect',function(){
    console.log('disconnected from server');
});

socket.on('newMessage',function(message){
    //console.log('newMessage',message);

    var formattedTime = moment(message.createdAt).format('h:mm a');

    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime} : ${message.text}`);

    jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//     from:'Hello',
//     text:'hi'
// },function(data){
//     console.log('Got it',data);
// });

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from:'User',
        text: jQuery('[name=message]').val()
    },function(data){
        // console.log('Got it',data);
        jQuery('[name=message]').val('')
    });
});

var sendLocation = jQuery('#send-location');
sendLocation.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by ypur browser!');
    }

    sendLocation.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        sendLocation.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    },function(){
        sendLocation.removeAttr('disabled').text('Send location');
        alert('Unable to get location');
    })
});

socket.on('newLocationMessage',function(message){

    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    var formattedTime = moment(message.createdAt).format('h:mm a');

    li.text(`${message.from} ${formattedTime} : `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
});