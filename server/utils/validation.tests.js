const expect = require('expect');

const {isRealString} = require('./validation');


describe('is real string',()=>{
    it('Should reject non string values',()=>{
        var res= isRealString(98);
        expect(res).toBe(false);  
    });

    it('Should reject string with spaces',()=>{
        var res= isRealString('   ');
        expect(res).toBe(false); 
    });

    it('Should allow string with non-space characters',()=>{
        var res= isRealString(' Dwijesh ');
        expect(res).toBe(true); 
    });
});