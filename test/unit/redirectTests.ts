import { assert } from 'assertthat';
import { redirect } from '../../lib/redirect';

suite('redirect', (): void => {
  suite('returns null', (): void => {
    test('for localhost.', async (): Promise<void> => {
      assert.that(redirect('http', 'localhost', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
    });

    test('for localhost:3000.', async (): Promise<void> => {
      assert.that(redirect('http', 'localhost:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
    });

    test('for https localhost:3000.', async (): Promise<void> => {
      assert.that(redirect('https', 'localhost:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.null();
    });

    test('for 192.168.x.x.', async (): Promise<void> => {
      assert.that(redirect('http', '192.168.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 3000
      })).is.null();
    });

    test('for 127.0.0.1.', async (): Promise<void> => {
      assert.that(redirect('http', '127.0.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 3000
      })).is.null();
    });

    test('for https 127.0.0.1.', async (): Promise<void> => {
      assert.that(redirect('https', '127.0.0.1', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        port: 3000
      })).is.null();
    });

    test('for 192.168.x.x:3000.', async (): Promise<void> => {
      assert.that(redirect('http', '192.168.0.1:3000', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        port: 3000
      })).is.null();
    });

    test('for https 192.168.x.x:3000.', async (): Promise<void> => {
      assert.that(redirect('https', '192.168.0.1:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.null();
    });

    test('for excluded hostname.', async (): Promise<void> => {
      assert.that(redirect('http', 'app.example2.com', '/foo/bar', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        port: 4000
      })).is.null();
    });

    test('for the forced domain with the correct port.', async (): Promise<void> => {
      assert.that(redirect('http', 'www.thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.null();
    });

    test('when non-www is preferred.', async (): Promise<void> => {
      assert.that(redirect('https', 'thenativeweb.io', '/foo/bar', {
        hostname: 'thenativeweb.io',
        protocol: 'https',
        type: 'permanent'
      })).is.null();
    });
  });

  suite('returns a permanent redirect', (): void => {
    test('for the forced domain with another port.', async (): Promise<void> => {
      assert.that(redirect('http', 'www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the correct port.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with another port.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        port: 4000
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the correct protocol.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'http'
      })).is.equalTo({
        type: 'permanent',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the another protocol.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        protocol: 'https'
      })).is.equalTo({
        type: 'permanent',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain without changing protocol.', async (): Promise<void> => {
      assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io'
      })).is.equalTo({
        type: 'permanent',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
    });
  });

  suite('returns a temporary redirect', (): void => {
    test('for the forced domain with another port.', async (): Promise<void> => {
      assert.that(redirect('http', 'www.thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the correct port.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with another port.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:3000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        port: 4000,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the correct protocol.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'http',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'http://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain with the another protocol.', async (): Promise<void> => {
      assert.that(redirect('http', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        protocol: 'https',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu,
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('for another domain without changing protocol.', async (): Promise<void> => {
      assert.that(redirect('https', 'thenativeweb.io:4000', '/foo/bar', {
        hostname: 'www.thenativeweb.io',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://www.thenativeweb.io:4000/foo/bar'
      });
    });

    test('when non-www is preferred.', async (): Promise<void> => {
      assert.that(redirect('https', 'www.thenativeweb.io', '/foo/bar', {
        hostname: 'thenativeweb.io',
        protocol: 'https',
        type: 'temporary'
      })).is.equalTo({
        type: 'temporary',
        url: 'https://thenativeweb.io/foo/bar'
      });
    });
  });
});
