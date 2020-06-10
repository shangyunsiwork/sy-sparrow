/* eslint-disable no-return-await */
/** eslint disable */
const { BaseContextModel, } = require('../../lib');

class TestService extends BaseContextModel {
  async list () {
    const res = await this.sequelize.test.list();
    return res;
  }
}

module.exports = TestService;
