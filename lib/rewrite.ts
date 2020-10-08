import { RewriteOptions } from './RewriteOptions';
import { format, parse } from 'url';

const rewrite = function (route: string, options: RewriteOptions = {}): string {
  const parsedRoute = parse(route);

  parsedRoute.host = null;

  if (options.protocol) {
    parsedRoute.protocol = options.protocol;
  }
  if (options.hostname) {
    parsedRoute.hostname = options.hostname;
  }
  if (options.port) {
    parsedRoute.port = String(options.port);
  }

  return format(parsedRoute);
};

export { rewrite };
