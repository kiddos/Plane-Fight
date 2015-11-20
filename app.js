var http = require('http');
var fs = require('fs');
var io = require('socket.io');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/planefight';

var ROOT = '/';

var LOGIN_PAGE = './login.html';
var REGISTER_PAGE = './register.html';
var PLAY_PAGE = './play.html';
var ERROR_PAGE = './error.html';

var CONTENT_TYPE = 'Content-Type';
var TYPE_HTML = 'text/html';
var TYPE_CSS = 'text/css';
var TYPE_JAVASCRIPT = 'text/javascript';
var TYPE_PNG = 'image/png';
var TYPE_ICO = 'image/ico';


var server = http.createServer(function(req, res) {
  if (req.method == 'GET') {
    console.log('request for ' + req.url);

    if (req.url === ROOT) {
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
    } else if (req.url === '/register' ||
        req.url === '/register.html' ||
        req.url === '/register.htm') {
      // register page
      fs.readFile(REGISTER_PAGE, function(err, data) {
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
    } else if (req.url === '/favicon.ico') {
      fs.readFile('./image/plane.ico', function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_ICO});
        res.write(data, function() {
          console.log(req.url + ': sent');
          res.end();
        });
      });
    }
  } else if (req.method == 'POST') {
    console.log('post for ' + req.url);

    // post data
    var body = '';
    var username = '';
    var password = '';
    req.on('data', function(data) {
      console.log(data.toString('utf-8'));
      var queryString = data.toString('utf-8');
      var queries = queryString.split('&');
      username = queries[0].split('=')[1];
      password = queries[1].split('=')[1];
    });

    if (req.url === ROOT) {
      // check if user exist in mongodb
      mongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log('connect to mongodb');
        console.log('validating user name');

        // query mongodb
        var cursor = db.collection('users').find({username: username});
        var notSend = true;
        cursor.each(function(err, doc){
          console.log(doc);
          assert.equal(null, err);
          if (doc !== null) {
            // login info correct
            if (doc.password !== undefined &&
                doc.password === password) {
              // send the play page
              if (notSend) {
                notSend = false;
                fs.readFile(PLAY_PAGE, function(err, data){
                  assert.equal(null, err);

                  res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
                  res.write(data, function() {
                    console.log('post for play page');
                    console.log(PLAY_PAGE + ': sent\n');
                    res.end();
                  });
                });
              }
            } else {
              // send error page
              if (notSend) {
                notSend = false;
                fs.readFile(ERROR_PAGE, function(err, data){
                  res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
                  res.write(data, function() {
                    console.log('post for play page');
                    console.log('login info incorrect');
                    console.log(ERROR_PAGE + ': sent\n');
                    res.end();
                  });
                });
              }
            }
          } else {
            // send error page
            if (notSend) {
              fs.readFile(ERROR_PAGE, function(err, data){
                res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
                res.write(data, function() {
                  console.log('post for play page');
                  console.log('login entry not found');
                  console.log(ERROR_PAGE + ': sent\n');
                  res.end();
                });
              });
            }
            db.close();
          }
        });
      });
    } else if(req.url === '/register') {
      fs.readFile(PLAY_PAGE, function(err, data) {
        res.writeHead(200, {CONTENT_TYPE: TYPE_HTML});
        res.write(data, function() {
          console.log(PLAY_PAGE + ': sent');
          res.end();

          mongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log('Connected to mongodb');

            var collection = db.collection('users');
            collection.find({username: username}).
                toArray(function(err, entries) {
                  if (entries.length === 0) {
                    collection.insert(
                    {
                      username: username,
                      password: password,
                      skill1level: 1,
                      skill2level: 1,
                      skill3level: 1,
                      skill4level: 1,
                      skill5level: 1,
                      skill6level: 1,
                      skill7level: 1,
                      skill8level: 1
                    }, function(err, result) {
                      assert.equal(err, null);
                      console.log('user data inserted to database');
                      console.log('closing connection');
                      db.close();
                    });
                  } else {
                    console.log('ERROR: fail to register, entry exists');
                  }
                });
          });
        });
      });
    }
  }
});

console.log('server setup');
server.listen(3000);
console.log('server running\n');

