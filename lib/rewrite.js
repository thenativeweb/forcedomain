'use strict';

const url = require('url');

const defaults = require('lodash/defaults');

const rewrite = function (route, options) {
  /* eslint-disable no-param-reassign */
  options = defaults({
    protocol: undefined,
    hostname: undefined
  }, options);
  /* eslint-enable no-param-reassign */

  const parsedRoute = url.parse(route);

  parsedRoute.host = undefined;

  if (options.protocol) {
    parsedRoute.protocol = options.protocol;
  }
  if (options.hostname) {
    parsedRoute.hostname = options.hostname;
  }
  if (options.port) {
    parsedRoute.port = options.port;
  }

  return url.format(parsedRoute);
};

module.exports = rewrite;
