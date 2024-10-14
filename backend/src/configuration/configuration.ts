export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    type: 'postgres',
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    databaseName: process.env.POSTGRES_DB || 'kupipodariday',
  },
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
  jwtSecretTtl: process.env.JWT_SECRET_TTL || '7d',
})
