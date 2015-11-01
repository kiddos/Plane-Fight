var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(req, res) {
  if (req.method == 'GET') {
    console.log('request for ' + req.url);

    if (req.url === '/') {
      fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, function() {
          console.log('index.html' + ': sent');
          res.end();
        });
      });
    } else if (req.url === '/login' ||
        req.url === '/login.html' ||
        req.url === '/login.htm') {
      fs.readFile('./login.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('js') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('css') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    } else if (req.url.indexOf('png') !== -1) {
      fs.readFile('.' + req.url, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/png'});
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

      fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
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
console.log('server running');

