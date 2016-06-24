'use strict';

const fs = require('fs'),
      https = require('https'),
      path = require('path');

const assert = require('assertthat'),
      express = require('express'),
      request = require('supertest');

const forceDomain = require('../lib/forceDomain');

suite('forceDomain', () => {
  suite('hostname only', () => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com'
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    test('does not redirect on localhost.', done => {
      request(app).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host.', done => {
      request(app).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('http://www.example.com/');
          res.resume();
          done();
        });
    });
  });

  suite('hostname and port', () => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      port: 4000
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    test('does not redirect on localhost.', done => {
      request(app).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host and port.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com:4000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects permanently on correct host, but other port.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('http://www.example.com:4000/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host.', done => {
      request(app).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('http://www.example.com:4000/');
          res.resume();
          done();
        });
    });
  });

  suite('hostname and protocol', () => {
    const app = express();

    app.use(forceDomain({
      protocol: 'https',
      hostname: 'www.example.com'
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    const appHttps = https.createServer({
      /* eslint-disable no-sync */
      key: fs.readFileSync(path.join(__dirname, 'keys', 'privateKey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem')),
      ca: [ fs.readFileSync(path.join(__dirname, 'keys', 'caCertificate.pem')) ]
      /* eslint-enable no-sync */
    }, app);

    /* eslint-disable no-process-env */
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    /* eslint-enable no-process-env */

    test('does not redirect on localhost.', done => {
      request(app).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects on correct host and port, but other protocol.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com:4000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on correct host, but other protocol.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host, other protocol.', done => {
      request(app).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host, same protocol.', done => {
      request(appHttps).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('does not redirect on correct protocol and host.', done => {
      request(appHttps).
        get('/').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });
  });

  suite('hostname, port and protocol', () => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      port: 4000,
      protocol: 'https'
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    const appHttps = https.createServer({
      /* eslint-disable no-sync */
      key: fs.readFileSync(path.join(__dirname, 'keys', 'privateKey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem')),
      ca: [ fs.readFileSync(path.join(__dirname, 'keys', 'caCertificate.pem')) ]
      /* eslint-enable no-sync */
    }, app);

    /* eslint-disable no-process-env */
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    /* eslint-enable no-process-env */

    test('does not redirect on localhost.', done => {
      request(appHttps).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host and port.', done => {
      request(appHttps).
        get('/').
        set('host', 'www.example.com:4000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects permanently on correct host, but other port.', done => {
      request(appHttps).
        get('/').
        set('host', 'www.example.com:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host.', done => {
      request(appHttps).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
          res.resume();
          done();
        });
    });
  });

  suite('hostname and x-forwarded-proto header', () => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      protocol: 'https'
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    test('does not redirect on localhost.', done => {
      request(app).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects on correct host and port, but other protocol.', done => {
      request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.example.com:4000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on correct host, but other protocol.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host, other protocol.', done => {
      request(app).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('redirects permanently on any other host, same protocol.', done => {
      request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(301);
          assert.that(res.header.location).is.equalTo('https://www.example.com/');
          res.resume();
          done();
        });
    });

    test('does not redirect on correct protocol and host.', done => {
      request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });
  });

  suite('temporary redirects', () => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      type: 'temporary'
    }));

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    test('does not redirect on localhost.', done => {
      request(app).
        get('/').
        set('host', 'localhost:3000').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('does not redirect on correct host.', done => {
      request(app).
        get('/').
        set('host', 'www.example.com').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(200);
          res.resume();
          done();
        });
    });

    test('redirects temporarily on any other host.', done => {
      request(app).
        get('/').
        set('host', 'www.thenativeweb.io').
        end((err, res) => {
          assert.that(err).is.null();
          assert.that(res.statusCode).is.equalTo(307);
          assert.that(res.header.location).is.equalTo('http://www.example.com/');
          res.resume();
          done();
        });
    });
  });
});
