'use strict';

var express = require('express');
var app = express();

//Set port number
app.set('port', (process.env.PORT || 3333));
//serve the public and node modules folder
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//listen on the port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});