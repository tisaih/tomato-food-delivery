module.exports = {
  client: 'postgresql',
  connection: {
    host: 'localhost', // process.env.DATABASE_HOST,
    port: '5432', // process.env.DATABASE_PORT,  
    database: 'tomato_food', // process.env.DATABASE_NAME,
    user: 'postgres', // process.env.DATABASE_USER,
    password: '123mudar', // process.env.DATABASE_PASSWORD,
    ssl: null // process.env.NODE_ENV === 'development' ? null : { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './config/migrations'
  }
}