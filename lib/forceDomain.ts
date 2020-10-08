import { Options } from './Options';
import { redirect } from './redirect';
import { RequestHandler } from 'express';

const forceDomain = function (options: Options): RequestHandler {
  return function (req, res, next): void {
    const [ protocol ] = [ req.headers['x-forwarded-proto'] ?? req.protocol ].flat();
    const newRoute = redirect(protocol, req.headers.host, req.url, options);

    if (!newRoute) {
      return next();
    }

    const statusCode = newRoute.type === 'temporary' ? 307 : 301;

    res.writeHead(statusCode, {
      Location: newRoute.url
    });
    res.end();
  };
};

export { forceDomain };
