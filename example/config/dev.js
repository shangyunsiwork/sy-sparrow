export default {
  host: '0.0.0.0',
  env: 'base',
  port: 3000,
  mysql: {
    sync: {
      database: 'base_sync',
      user: 'root',
      password: '123456',
      host: 'localhost',
      port: 3306,
      debug: true,
    },
  },
  sequelize: {
    sync: {
      database: 'base_sync',
      user: 'root',
      password: '123456',
      config: {
        host: 'localhost',
        port: 3306,
        debug: true,
        dialect: 'mysql',
      },
    },
  },
};
