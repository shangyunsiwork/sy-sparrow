## sparrow

### config 配置
```js
// 日志组件
{
  // 基础配置
  logger: logger,
  host: '0.0.0.0',
  env: 'base',
  port: 3000,
  // 文件目录
  dir: {
    src: 'app',
    controller: 'controller',
    services: 'services',
    biz: 'biz',
    schema: 'schema',
    dao: 'dao',
    sequelize: 'sequelize',
  },
  // 中间键
  middleware: [], 
  mdRewrite: [], // { index: 0 , func: ()=>{} }
  // mysql
  mysql: {
    sync: {
      database: 'base_sync',
      user: 'root',
      password: '123456',
      // password: 'pwdroot',
      // host: '10.0.34.16',
      host: 'localhost',
      port: 3306,
      debug: true,
    },
  },
  // sequelize 相关配置
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
  // hooks
  hooks: {
    // params 之后  schame 之前的钩子
    beforeRouter: async (ctx, next) => { await next(); },
  },
  // sentry 相关
  isMonitor: true,  // 是否启用sentry 监控
  sentry: '', // sentry地址
  name: 'sparrow',  // 项目名称
  version: require(process.cwd() + '/package.json').version, // 项目版本
}
```

