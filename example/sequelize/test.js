const Sequelize = require('sequelize');
const { BaseSequelizeDao, } = require('../../lib');

module.exports = class TestDao extends BaseSequelizeDao {
  constructor (props) {
    super(props);
    this.database = 'sync';
    this.init();
  }

  init () {
    super.init();

    const { STRING, } = Sequelize;
    this.table = this.$db.define('base_sync', {
      syncid: { type: STRING, },
      name: { type: STRING, },
    }, {
      timestamps: false,
      freezeTableName: true,
      tableName: 'base_sync',
    });
  }

  async list () {
    let res = await this.table.findAll();
    return res;
  }
};
