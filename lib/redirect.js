'use strict';

const defaults = require('lodash/defaults');

const rewrite = require('./rewrite');

const redirect = function (protocol, hostHeader, url, options) {
  /* eslint-disable no-param-reassign */
  options = defaults(options, {
    protocol: undefined,
    type: 'permanent'
  });
  /* eslint-enable no-param-reassign */

  const hostHeaderParts = (hostHeader || '').split(':');
  const hostname = hostHeaderParts[0] || '';
  const port = (hostHeaderParts[1] - 0) || undefined;
  const targetProtocol = options.protocol ? options.protocol : protocol;

  if (
    (hostname === 'localhost' || hostname === '127.0.0.1') ||
    hostname.startsWith('192.168.') ||
    (hostname === options.hostname && port === options.port && protocol === targetProtocol) ||
    (options.excludeRule && hostname.match(options.excludeRule))
  ) {
    return null;
  }

  /* eslint-disable prefer-template */
  const route = `${targetProtocol}://${hostname}${port ? ':' + port : ''}${url}`;
  /* eslint-enable prefer-template */
  const rewrittenRoute = rewrite(route, options);

  return {
    type: options.type,
    url: rewrittenRoute
  };
};

module.exports = redirect;
