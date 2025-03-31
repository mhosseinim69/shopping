export default () => ({
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'shopping',
  },
  jwt: {
    secret: 'your_secret_key',
    expiresIn: '24h',
  },
});
