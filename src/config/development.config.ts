export default () => ({
  environment: 'development',
  database: {
    host: 'localhost',
    user: 'dev_user',
    password: process.env.DATABASE_PASSWORD,
    name: 'dev_database',
  },
});
