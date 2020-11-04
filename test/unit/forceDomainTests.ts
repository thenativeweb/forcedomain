import { assert } from 'assertthat';
import { forceDomain } from '../../lib/forceDomain';
import fs from 'fs';
import https from 'https';
import path from 'path';
import request from 'supertest';
import express, { Application } from 'express';

const keysDirectory = path.join(__dirname, '..', 'shared', 'keys');

suite('forceDomain', (): void => {
  suite('hostname only', (): void => {
    let app: Application;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        hostname: 'www.example.com',
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.example2\.com/iu
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on correct host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on excluded host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'app.example2.com');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects permanently on any other host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('http://www.example.com/');
      res.resume();
    });
  });

  suite('hostname and port', (): void => {
    let app: Application;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        hostname: 'www.example.com',
        port: 4_000
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on correct host and port.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com:4000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects permanently on correct host, but other port.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com:3000');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('http://www.example.com:4000/');
      res.resume();
    });

    test('redirects permanently on any other host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('http://www.example.com:4000/');
      res.resume();
    });
  });

  suite('hostname and protocol', (): void => {
    let app: Application,
        appHttps: https.Server;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        protocol: 'https',
        hostname: 'www.example.com'
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });

      appHttps = https.createServer({
        key: await fs.promises.readFile(path.join(keysDirectory, 'privateKey.pem')),
        cert: await fs.promises.readFile(path.join(keysDirectory, 'certificate.pem')),
        ca: [ await fs.promises.readFile(path.join(keysDirectory, 'caCertificate.pem')) ]
      }, app);

      // eslint-disable-next-line no-process-env
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects on correct host and port, but other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com:4000');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
      res.resume();
    });

    test('redirects permanently on correct host, but other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('redirects permanently on any other host, other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('redirects permanently on any other host, same protocol.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('does not redirect on correct protocol and host.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });
  });

  suite('hostname, port and protocol', (): void => {
    let app: Application,
        appHttps: https.Server;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        hostname: 'www.example.com',
        port: 4_000,
        protocol: 'https'
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });

      appHttps = https.createServer({
        key: await fs.promises.readFile(path.join(keysDirectory, 'privateKey.pem')),
        cert: await fs.promises.readFile(path.join(keysDirectory, 'certificate.pem')),
        ca: [ await fs.promises.readFile(path.join(keysDirectory, 'caCertificate.pem')) ]
      }, app);

      // eslint-disable-next-line no-process-env
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on correct host and port.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'www.example.com:4000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects permanently on correct host, but other port.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'www.example.com:3000');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
      res.resume();
    });

    test('redirects permanently on any other host.', async (): Promise<void> => {
      const res = await request(appHttps).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
      res.resume();
    });
  });

  suite('hostname and x-forwarded-proto header', (): void => {
    const app = express();

    app.use(forceDomain({
      hostname: 'www.example.com',
      protocol: 'https'
    }));

    app.get('/', (req, res): void => {
      res.sendStatus(200);
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects on correct host and port, but other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.example.com:4000');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com:4000/');
      res.resume();
    });

    test('redirects permanently on correct host, but other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('redirects permanently on any other host, other protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('redirects permanently on any other host, same protocol.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('https://www.example.com/');
      res.resume();
    });

    test('does not redirect on correct protocol and host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('x-forwarded-proto', 'https').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });
  });

  suite('temporary redirects', (): void => {
    let app: Application;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        hostname: 'www.example.com',
        type: 'temporary'
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });
    });

    test('does not redirect on localhost.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'localhost:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 192.168.x.x.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '192.168.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on 127.0.0.1.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', '127.0.0.1:3000');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('does not redirect on correct host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.example.com');

      assert.that(res.status).is.equalTo(200);
      res.resume();
    });

    test('redirects temporarily on any other host.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(307);
      assert.that(res.header.location).is.equalTo('http://www.example.com/');
      res.resume();
    });
  });

  suite('host header port and options port ', (): void => {
    let app: Application;

    suiteSetup(async (): Promise<void> => {
      app = express();

      app.use(forceDomain({
        hostname: 'www.example.com',
        port: 80
      }));

      app.get('/', (req, res): void => {
        res.sendStatus(200);
      });
    });

    test('redirects permanently on any other host without port.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('http://www.example.com:80/');
      res.resume();
    });

    test('redirects permanently on any other host with port.', async (): Promise<void> => {
      const res = await request(app).
        get('/').
        set('host', 'www.thenativeweb.io:80');

      assert.that(res.status).is.equalTo(301);
      assert.that(res.header.location).is.equalTo('http://www.example.com:80/');
      res.resume();
    });
  });
});
