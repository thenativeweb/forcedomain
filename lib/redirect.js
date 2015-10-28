'use strict';

var _ = require('lodash');

var rewrite = require('./rewrite');

var redirect = function (protocol, hostHeader, url, options) {
  var hostHeaderParts,
      hostname,
      port,
      rewrittenRoute,
      useProtocol,
      route;

  options = _.defaults(options, {
    protocol: undefined,
    type: 'temporary'
  });

  hostHeaderParts = (hostHeader || '').split(':');
  hostname = hostHeaderParts[0] || '';
  port = (hostHeaderParts[1] - 0) || undefined;

    if (!options.protocol){
        useProtocol = protocol
    } else {
        useProtocol = options.protocol
    }

  if (
    (hostname === 'localhost') ||
    (hostname === options.hostname && port === options.port && protocol === useProtocol)
  ) {
    return null;
  }

  route = useProtocol + '://' + hostname + (port ? ':' + port : '') + url;
  rewrittenRoute = rewrite(route, options);

  /* eslint-disable consistent-return */
  return {
    type: options.type,
    url: rewrittenRoute
  };
  /* eslint-enable consistent-return */
};

module.exports = redirect;
