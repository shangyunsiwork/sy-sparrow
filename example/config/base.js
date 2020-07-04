import middleware from '../middleware';

export default {
  logger: console,
  name: 'sparrow-example',
  dir: {
    src: 'dist',
    controller: 'controller',
    services: 'services',
    biz: 'biz',
    schema: 'schema',
    dao: 'dao',
    sequelize: 'sequelize',
  },
  hooks: {
    // params 之后  schame 之前的钩子
    beforeRouter: async (ctx, next) => { await next(); },
  },
  isMonitor: true,
  middleware: middleware,
  sentry: '',
  version: require(process.cwd() + '/package.json').version,
};
