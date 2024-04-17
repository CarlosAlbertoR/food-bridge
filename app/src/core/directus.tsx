import { authentication, createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://localhost:8055')
  .with(authentication('json'))
  .with(rest());

export default directus;
