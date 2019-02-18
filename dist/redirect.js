'use strict';

var _ = require('lodash');

var rewrite = require('./rewrite');

var redirect = function redirect(protocol, hostHeader, url, options) {
  options = _.defaults(options, {
    protocol: undefined,
    type: 'permanent'
  });
  var hostHeaderParts = (hostHeader || '').split(':');
  var hostname = hostHeaderParts[0] || '';
  var port = hostHeaderParts[1] - 0 || undefined;
  var targetProtocol = options.protocol ? options.protocol : protocol;

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname === options.hostname && port === options.port && protocol === targetProtocol || options.excludeRule && hostname.match(options.excludeRule)) {
    return null;
  }
  /* eslint-disable prefer-template */


  var route = "".concat(targetProtocol, "://").concat(hostname).concat(port ? ':' + port : '').concat(url);
  /* eslint-enable prefer-template */

  var rewrittenRoute = rewrite(route, options);
  return {
    type: options.type,
    url: rewrittenRoute
  };
};

module.exports = redirect;