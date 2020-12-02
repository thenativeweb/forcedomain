import { RedirectType } from './RedirectType';

export interface Options {
  protocol?: string;
  hostname: string;
  port?: number;
  type?: RedirectType;
  excludeRule?: RegExp;
  isEnabled?: boolean;
}
