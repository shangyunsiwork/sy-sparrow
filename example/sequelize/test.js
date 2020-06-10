const Sequelize = require('sequelize');

module.exports = class TestDao {
  constructor (props) {
    this.table = props.$sequelize.sync;

    const { STRING, } = Sequelize;
    this.table = this.table.define('base_sync', {
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
