import { Options } from './Options';
import { RedirectType } from './RedirectType';
import { rewrite } from './rewrite';

const redirect = function (protocol: string, hostHeader: string | undefined, url: string, options: Options): {
  type: RedirectType;
  url: string;
} | null {
  const hostHeaderParts = (hostHeader ?? '').split(':') as (string | undefined)[];

  const hostname = hostHeaderParts[0] ?? '';
  const port = hostHeaderParts[1] ? Number(hostHeaderParts[1]) : undefined;
  const targetProtocol = options.protocol ?? protocol;
  const isEnabled = options.isEnabled ?? true;

  if (
    (hostname === 'localhost' || hostname === '127.0.0.1') ||
    hostname.startsWith('192.168.') || !isEnabled ||
    (hostname === options.hostname && port === options.port && protocol === targetProtocol) ||
    (options.excludeRule && options.excludeRule.test(hostname))
  ) {
    return null;
  }

  const route = `${targetProtocol}://${hostname}${port ? `:${port}` : ''}${url}`;
  const rewrittenRoute = rewrite(route, options);

  return {
    type: options.type ?? 'permanent',
    url: rewrittenRoute
  };
};

export { redirect };
