import { RouterDerocator, BaseContextModel, } from '../../lib';

@RouterDerocator.Controller('/api/test2')
class TestController extends BaseContextModel {
  @RouterDerocator.Get('/list')
  async list (ctx) {
    ctx.body = await this.services.test2.list();
  }
}

export default TestController;
