var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage',()=>{
    it('Should generate a message',()=>{
        var from = 'Dwijesh';
        var text = 'Hello Test!';
        var message = generateMessage(from,text);

        expect(message.createdAt).not.toBe(String);
        expect(message).toMatchObject({from,text});
    });
});