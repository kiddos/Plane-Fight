var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var LOGIN_PAGE = './login.html';
var PLAY_PAGE = './play.html';

var CONTENT_TYPE = 'Content-Type';
var TYPE_HTML = 'text/html';
var TYPE_CSS = 'text/css';
var TYPE_JAVASCRIPT = 'text/javascript';
var TYPE_PNG = 'image/png';

var server = http.createServer(function(req, res) {
  if (req.method == 'GET') {
    console.log('request for ' + req.url);

    if (req.url === '/') {
      // default page which is the login page
      fs.readFile(LOGIN_PAGE, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
        res.write(data, function() {
          console.log('login.html' + ': sent');
          res.end();
        });
      });
    } else if (req.url === '/login' ||
        req.url === '/login.html' ||
        req.url === '/login.htm') {
      // login page
      fs.readFile(LOGIN_PAGE, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('js') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_JAVASCRIPT});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('css') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_CSS});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('png') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_PNG});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    }
  } else if (req.method == 'POST') {
    console.log('post for ' + req.url);

    if (req.url === '/') {
      var body = '';
      req.on('data', function(data) {
        console.log(data);
      });

      fs.readFile(PLAY_PAGE, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
        res.write(data, function() {
          console.log('index.html' + ': sent');
          res.end();
        });
      });
    }
  }
});

console.log('server setup');
server.listen(3000);
console.log('server running\n');

