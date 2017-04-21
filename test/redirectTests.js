'use strict';

const assert = require('assertthat');

const redirect = require('../lib/redirect');

suite('redirect', () => {
  suite('returns null', () => {
    test('for localhost.', done => {
      assert.that(redirect('http', 'localhost', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('for localhost:3000.', done => {
      assert.that(redirect('http', 'localhost:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('for https localhost:3000.', done => {
      assert.that(redirect('https', 'localhost:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.null();
      done();
    });

    test('for 192.168.x.x.', done => {
      assert.that(redirect('http', '192.168.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 3000
      })).is.null();
      done();
    });

    test('for 127.0.0.1.', done => {
      assert.that(redirect('http', '127.0.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 3000
      })).is.null();
      done();
    });

    test('for https 127.0.0.1.', done => {
      assert.that(redirect('https', '127.0.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        port: 3000
      })).is.null();
      done();
    });

    test('for 192.168.x.x:3000.', done => {
      assert.that(redirect('http', '192.168.0.1:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        port: 3000
      })).is.null();
      done();
    });

    test('for https 192.168.x.x:3000.', done => {
      assert.that(redirect('https', '192.168.0.1:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.null();
      done();
    });

    test('for excluded hostname.', done => {
      assert.that(redirect('http', 'app.example2.com', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        port: 4000
      })).is.null();
      done();
    });

    test('for the forced domain with the correct port.', done => {
      assert.that(redirect('http', 'www.thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('when non-www is preferred.', done => {
      assert.that(redirect('https', 'thenativeweb.io', '/foo/bar', {
        hostname: 'thenativeweb.io',
        protocol: 'https',
        type: 'permanent'
      })).is.null();
      done();
    });
  });

  suite('returns a permanent redirect', () => {
    test('for the forced domain with another port.', done => {
      assert.that(redirect('http', 'www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the correct port.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with another port.', done => {
      assert.that(redirect('http', 'thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the correct protocol.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'http'
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the another protocol.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        protocol: 'https'
      })).is.equalTo({
        type: 'permanent',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain without changing protocol.', done => {
      assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.equalTo({
        type: 'permanent',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });
  });

  suite('returns a temporary redirect.', () => {
    test('for the forced domain with another port.', done => {
      assert.that(redirect('http', 'www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the correct port.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with another port.', done => {
      assert.that(redirect('http', 'thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the correct protocol.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'http',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the another protocol.', done => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'https',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/i,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain without changing protocol.', done => {
      assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('when non-www is preferred.', done => {
      assert.that(redirect('https', 'www.thenativeweb.io', '/foo/bar', {
        hostname: 'thenativeweb.io',
        protocol: 'https',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://thenativeweb.io/foo/bar'
      });
      done();
    });
  });
});
