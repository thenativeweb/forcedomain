'use strict';

var assert = require('assertthat'),
    cases = require('cases');

var rewrite = require('../lib/rewrite');

suite('rewrite', function () {
  suite('does not rewrite', function () {
    test('when there are no options given.', cases([
      [ 'http://www.thenativeweb.io/' ],
      [ 'http://www.thenativeweb.io:3000/' ],
      [ 'http://www.thenativeweb.io:3000/foo/bar' ],
      [ 'https://www.thenativeweb.io/' ]
    ], function (url, done) {
      assert.that(rewrite(url)).is.equalTo(url);
      done();
    }));
  });

  suite('rewrites', function () {
    test('the protocol.', cases([
      [ 'http://www.thenativeweb.io/', 'https://www.thenativeweb.io/' ],
      [ 'http://www.thenativeweb.io:3000/', 'https://www.thenativeweb.io:3000/' ],
      [ 'http://www.thenativeweb.io:3000/foo/bar', 'https://www.thenativeweb.io:3000/foo/bar' ],
      [ 'https://www.thenativeweb.io/', 'https://www.thenativeweb.io/' ]
    ], function (url, expectedUrl, done) {
      assert.that(rewrite(url, {
        protocol: 'https'
      })).is.equalTo(expectedUrl);
      done();
    }));

    test('the hostname.', cases([
      [ 'http://thenativeweb.io/', 'http://www.thenativeweb.io/' ],
      [ 'http://thenativeweb.io:3000/', 'http://www.thenativeweb.io:3000/' ],
      [ 'http://thenativeweb.io:3000/foo/bar', 'http://www.thenativeweb.io:3000/foo/bar' ],
      [ 'https://thenativeweb.io/', 'https://www.thenativeweb.io/' ]
    ], function (url, expectedUrl, done) {
      assert.that(rewrite(url, {
        hostname: 'www.thenativeweb.io'
      })).is.equalTo(expectedUrl);
      done();
    }));

    test('the port.', cases([
      [ 'http://www.thenativeweb.io/', 'http://www.thenativeweb.io:4000/' ],
      [ 'http://www.thenativeweb.io:3000/', 'http://www.thenativeweb.io:4000/' ],
      [ 'http://www.thenativeweb.io:3000/foo/bar', 'http://www.thenativeweb.io:4000/foo/bar' ],
      [ 'https://www.thenativeweb.io/', 'https://www.thenativeweb.io:4000/' ]
    ], function (url, expectedUrl, done) {
      assert.that(rewrite(url, {
        port: 4000
      })).is.equalTo(expectedUrl);
      done();
    }));

    test('the protocol, the hostname and the port all at once.', cases([
      [ 'http://thenativeweb.io', 'https://www.thenativeweb.io:4000/' ]
    ], function (url, expectedUrl, done) {
      assert.that(rewrite(url, {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo(expectedUrl);
      done();
    }));
  });
});
