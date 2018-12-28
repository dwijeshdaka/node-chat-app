var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage',()=>{
    it('Should generate a message',()=>{
        var from = 'Dwijesh';
        var text = 'Hello Test!';
        var message = generateMessage(from,text);

        expect(message.createdAt).not.toBe(String);
        expect(message).toMatchObject({from,text});
    });
});

describe('generateLocationMessage',()=>{
    it('Should generate a location message',()=>{
        var from = 'Dwijesh';
        var lon = 110;
        var lat = 15;
        var url = 'https://www.google.com/maps?q=15,110';
        var message = generateLocationMessage(from,lat,lon);

        expect(message.createdAt).not.toBe(String);
        expect(message).toMatchObject({from,url});
    });
});