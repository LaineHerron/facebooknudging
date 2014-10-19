/*jslint node: true*/
'use strict';
var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
app.get('/', function (req, res) {
    res.send('Hello World');
        
});

var privateKey  = fs.readFileSync('key2.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4430);
