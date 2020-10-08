import { assert } from 'assertthat';
import { rewrite } from '../../lib/rewrite';

suite('rewrite', (): void => {
  suite('does not rewrite', (): void => {
    test('when there are no options given.', async (): Promise<void> => {
      for (const url of [
        'http://www.thenativeweb.io/',
        'http://www.thenativeweb.io:3000/',
        'http://www.thenativeweb.io:3000/foo/bar',
        'https://www.thenativeweb.io/'
      ]) {
        assert.that(rewrite(url)).is.equalTo(url);
      }
    });
  });

  suite('rewrites', (): void => {
    test('the protocol.', async (): Promise<void> => {
      for (const [ url, expectedUrl ] of [
        [ 'http://www.thenativeweb.io/', 'https://www.thenativeweb.io/' ],
        [ 'http://www.thenativeweb.io:3000/', 'https://www.thenativeweb.io:3000/' ],
        [ 'http://www.thenativeweb.io:3000/foo/bar', 'https://www.thenativeweb.io:3000/foo/bar' ],
        [ 'https://www.thenativeweb.io/', 'https://www.thenativeweb.io/' ]
      ]) {
        assert.that(rewrite(url, {
          protocol: 'https'
        })).is.equalTo(expectedUrl);
      }
    });

    test('the hostname.', async (): Promise<void> => {
      for (const [ url, expectedUrl ] of [
        [ 'http://thenativeweb.io/', 'http://www.thenativeweb.io/' ],
        [ 'http://thenativeweb.io:3000/', 'http://www.thenativeweb.io:3000/' ],
        [ 'http://thenativeweb.io:3000/foo/bar', 'http://www.thenativeweb.io:3000/foo/bar' ],
        [ 'https://thenativeweb.io/', 'https://www.thenativeweb.io/' ]
      ]) {
        assert.that(rewrite(url, {
          hostname: 'www.thenativeweb.io'
        })).is.equalTo(expectedUrl);
      }
    });

    test('the port.', async (): Promise<void> => {
      for (const [ url, expectedUrl ] of [
        [ 'http://www.thenativeweb.io/', 'http://www.thenativeweb.io:4000/' ],
        [ 'http://www.thenativeweb.io:3000/', 'http://www.thenativeweb.io:4000/' ],
        [ 'http://www.thenativeweb.io:3000/foo/bar', 'http://www.thenativeweb.io:4000/foo/bar' ],
        [ 'https://www.thenativeweb.io/', 'https://www.thenativeweb.io:4000/' ]
      ]) {
        assert.that(rewrite(url, {
          port: 4000
        })).is.equalTo(expectedUrl);
      }
    });

    test('the protocol, the hostname and the port all at once.', async (): Promise<void> => {
      assert.that(rewrite('http://thenativeweb.io', {
        protocol: 'https',
        hostname: 'www.thenativeweb.io',
        port: 4000
      })).is.equalTo('https://www.thenativeweb.io:4000/');
    });
  });
});
