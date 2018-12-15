const path = require('path');
const express =  require('express');

// console.log(__dirname + '/../public');

var publicPath = path.join(__dirname,'/../public')
//console.log(test)
var app = express();

const port = process.env.PORT || 3000; 

app.use(express.static(publicPath));

app.listen(port,()=>{
    console.log(`Server is running on ${port} !!`);
})

