
import { RouterDerocator, BaseContextModel, } from '../../lib';

@RouterDerocator.Controller('/')
class TestController extends BaseContextModel {
  @RouterDerocator.Get('')
  async list () {
    await this.ctx.render('index');
  }
}

export default TestController;
