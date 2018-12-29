var socket = io();

function scrollTobottom(){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight =  newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // console.log('Should scroll')
        messages.scrollTop(scrollHeight);
    }

    
}

socket.on('connect',function(){
    console.log('connected to server');
    var params= jQuery.deparam(window.location.search);

    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log('No error');
        }
    })
});

socket.on('disconnect',function(){
    console.log('disconnected from server');
});

socket.on('updateUserList',function(users){
    console.log('users list',users);
    var ol = jQuery('<ol></ol>');

    users.forEach(function(element){
        ol.append(jQuery('<li></li>').text(element));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage',function(message){
    //console.log('newMessage',message);
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime} : ${message.text}`);
    // jQuery('#messages').append(li);

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });
    jQuery('#messages').append(html);
    scrollTobottom();
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

    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location</a>');
    // var formattedTime = moment(message.createdAt).format('h:mm a');

    // li.text(`${message.from} ${formattedTime} : `);
    // a.attr('href',message.url);
    // li.append(a);
    // jQuery('#messages').append(li);


    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from : message.from,
        url : message.url,
        createdAt : formattedTime
    });
    jQuery('#messages').append(html);
    scrollTobottom();

});