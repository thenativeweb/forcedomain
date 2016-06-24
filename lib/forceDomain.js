'use strict';

const redirect = require('./redirect');

const forceDomain = function (options) {
  return function (req, res, next) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
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

module.exports = forceDomain;
