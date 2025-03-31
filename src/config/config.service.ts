import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: require('./development.config').default,
    production: require('./production.config').default,
    test: require('./test.config').default,
  };

  return {
    ...require('./default.config').default(),
    ...configs[env](),
  };
});
