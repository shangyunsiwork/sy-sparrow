
import { RouterDerocator, BaseContextModel, } from '../../lib';

@RouterDerocator.Controller('/test')
class TestController extends BaseContextModel {
  @RouterDerocator.Get('/list')
  async list () {
    this.app.ctx.body = await this.services.test.list();
  }
}

export default TestController;
