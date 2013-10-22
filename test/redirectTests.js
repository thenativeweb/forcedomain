'use strict';

var assert = require('node-assertthat');

var redirect = require('../lib/redirect');

suite('redirect', function () {
  suite('returns undefined', function () {
    test('for localhost.', function () {
      assert.that(redirect('localhost', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.undefined());
    });

    test('for localhost:3000.', function () {
      assert.that(redirect('localhost:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.undefined());
    });

    test('for the forced domain with the correct port.', function () {
      assert.that(redirect('www.thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.undefined());
    });
  });

  suite('returns a temporary redirect', function () {
    test('for the forced domain with another port.', function () {
      assert.that(redirect('www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });

    test('for another domain with the correct port.', function () {
      assert.that(redirect('thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });

    test('for another domain with another port.', function () {
      assert.that(redirect('thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      }), is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });
  });

  suite('returns a permanent redirect', function () {
    test('for the forced domain with another port.', function () {
      assert.that(redirect('www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'permanent'
      }), is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });

    test('for another domain with the correct port.', function () {
      assert.that(redirect('thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'permanent'
      }), is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });

    test('for another domain with another port.', function () {
      assert.that(redirect('thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'permanent'
      }), is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      }));
    });
  });
});
