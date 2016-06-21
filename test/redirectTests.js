'use strict';

var assert = require('assertthat');

var redirect = require('../lib/redirect');

suite('redirect', function () {
  suite('returns null', function () {
    test('for localhost.', function (done) {
      assert.that(redirect('http', 'localhost', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('for localhost:3000.', function (done) {
      assert.that(redirect('http', 'localhost:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

	test('for https localhost:3000.', function(done) {
		assert.that(redirect('https', 'localhost:3000', '/foo/bar', {
			hostname: 'www.thenativeweb.io'
		})).is.null();
		done();
	});

    test('for the forced domain with the correct port.', function (done) {
      assert.that(redirect('http', 'www.thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('for the forced domain with the correct port.', function (done) {
      assert.that(redirect('http', 'www.thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
      done();
    });

    test('when non-www is preferred.', function (done) {
      assert.that(redirect('https', 'thenativeweb.io', '/foo/bar', {
        hostname: 'thenativeweb.io',
        protocol: 'https',
        type: 'permanent'
      })).is.null();
      done();
    });
  });

  suite('returns a permanent redirect', function () {
    test('for the forced domain with another port.', function (done) {
      assert.that(redirect('http', 'www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with the correct port.', function (done) {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

    test('for another domain with another port.', function (done) {
      assert.that(redirect('http', 'thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
      done();
    });

	test('for another domain with the correct protocol.', function (done) {
		assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
			hostname: 'www.thenativeweb.io',
			protocol: 'http'
		})).is.equalTo({
			type: 'permanent',
			url: 'http://www.thenativeweb.io:4000/foo/bar'
		});
		done();
	});

	test('for another domain with the another protocol.', function (done) {
		assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
			hostname: 'www.thenativeweb.io',
			protocol: 'https'
		})).is.equalTo({
			type: 'permanent',
			url: 'https://www.thenativeweb.io:4000/foo/bar'
		});
		done();
	});

	test('for another domain without changing protocol.', function (done) {
		assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
			hostname: 'www.thenativeweb.io',
		})).is.equalTo({
			type: 'permanent',
			url: 'https://www.thenativeweb.io:4000/foo/bar'
		});
		done();
	});
  });

  suite('returns a temporary redirect.', function () {
    test('for the forced domain with another port.', function (done) {
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

    test('for another domain with the correct port.', function (done) {
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

    test('for another domain with another port.', function (done) {
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

	test('for another domain with the correct protocol.', function (done) {
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

	test('for another domain with the another protocol.', function (done) {
		assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
			hostname: 'www.thenativeweb.io',
			protocol: 'https',
			type: 'temporary'
		})).is.equalTo({
			type: 'temporary',
			url: 'https://www.thenativeweb.io:4000/foo/bar'
		});
		done();
	});

	test('for another domain without changing protocol.', function (done) {
		assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
			hostname: 'www.thenativeweb.io',
			type: 'temporary'
		})).is.equalTo({
			type: 'temporary',
			url: 'https://www.thenativeweb.io:4000/foo/bar'
		});
		done();
	});

    test('when non-www is preferred.', function (done) {
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
