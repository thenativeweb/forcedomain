'use strict';

var fs = require('fs'),
    https = require('https'),
    path = require('path');

var assert = require('node-assertthat'),
    express = require('express'),
    request = require('supertest');

var forceDomain = require('../lib/node-force-domain');

suite('node-force-domain', function () {
  suite('hostname only', function () {
    var app = express();

    app.use(forceDomain({
      hostname: 'www.example.com'
    }));

    app.get('/', function (req, res) {
      res.send(200);
    });

    test('does not redirect on localhost.', function (done) {
      request(app)
        .get('/')
        .set('host', 'localhost:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.example.com')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('http://www.example.com/'));
          res.resume();
          done();
        });
    });
  });

  suite('hostname and port', function () {
    var app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      port: 4000
    }));

    app.get('/', function (req, res) {
      res.send(200);
    });

    test('does not redirect on localhost.', function (done) {
      request(app)
        .get('/')
        .set('host', 'localhost:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host and port.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.example.com:4000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on correct host, but other port.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.example.com:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('http://www.example.com:4000/'));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('http://www.example.com:4000/'));
          res.resume();
          done();
        });
    });
  });

  suite('hostname and protocol', function () {
    var app = express();

    app.use(forceDomain({
      protocol: 'https',
      hostname: 'www.example.com'
    }));

    app.get('/', function (req, res) {
      res.send(200);
    });

    var appHttps = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'keys', 'privateKey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem')),
      ca: [ fs.readFileSync(path.join(__dirname, 'keys', 'caCertificate.pem')) ]
    }, app);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    
    test('does not redirect on localhost.', function (done) {
      request(app)
        .get('/')
        .set('host', 'localhost:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('redirects on correct host and port, but other protocol.', function (done) {
      request(app)
        .get('/')
        .set('protocol', 'http')
        .set('host', 'www.example.com:4000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on correct host, but other protocol.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.example.com')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('https://www.example.com/'));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host, other protocol.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('https://www.example.com/'));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host, same protocol.', function (done) {
      request(appHttps)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('https://www.example.com/'));
          res.resume();
          done();
        });
    });
    
    test('does not redirect on correct protocol and host.', function (done) {
      request(appHttps)
        .get('/')
        .set('protocol', 'https')
        .set('host', 'www.example.com')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });    
  });


  suite('hostname, port and protocol', function () {
    var app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      port: 4000,
      protocol: 'https'
    }));

    app.get('/', function (req, res) {
      res.send(200);
    });

    var appHttps = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'keys', 'privateKey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem')),
      ca: [ fs.readFileSync(path.join(__dirname, 'keys', 'caCertificate.pem')) ]
    }, app);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    test('does not redirect on localhost.', function (done) {
      request(appHttps)
        .get('/')
        .set('host', 'localhost:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host and port.', function (done) {
      request(appHttps)
        .get('/')
        .set('host', 'www.example.com:4000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on correct host, but other port.', function (done) {
      request(appHttps)
        .get('/')
        .set('host', 'www.example.com:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('https://www.example.com:4000/'));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host.', function (done) {
      request(appHttps)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(307));
          assert.that(res.header.location, is.equalTo('https://www.example.com:4000/'));
          res.resume();
          done();
        });
    });
  });

  suite('permanent redirects', function () {
    var app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      type: 'permanent'
    }));

    app.get('/', function (req, res) {
      res.send(200);
    });

    test('does not redirect on localhost.', function (done) {
      request(app)
        .get('/')
        .set('host', 'localhost:3000')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.example.com')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(200));
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host.', function (done) {
      request(app)
        .get('/')
        .set('host', 'www.thenativeweb.io')
        .end(function (err, res) {
          assert.that(err, is.null());
          assert.that(res.statusCode, is.equalTo(301));
          assert.that(res.header.location, is.equalTo('http://www.example.com/'));
          res.resume();
          done();
        });
    });
  });
});
