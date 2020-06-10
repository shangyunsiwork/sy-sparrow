import assert from 'assert';
import { BaseMysqlDao, } from '../../lib';
import { XError, isEmpty, } from '@xy/util';

module.exports = class Connection extends BaseMysqlDao {
  /**
   * 用户与角色的 关联关系 处理
   * 注：用户表-用户信息 来源于 OAuth 服务
   */
  constructor (props) {
    super(props);
    this.tableName = 'base_sync';
    this.defaultFields = [
      'syncid',
      'name',
      'description',
      'server_path',
      'content_type',
      'method',
      'type',
      'mtime',
      'email',
    ];
    this.mysql = props.$mysql.sync;
  }
  /*
   * 查询
   * @param {*} syncid
   */
  async list () {
    // step 1 查询原有app
    let searchSql = this.mysql.format('SELECT ?? FROM ?? WHERE invalid >= 1', [
      this.defaultFields,
      this.tableName,
    ]);
    let [ res, ] = await this.mysql.query(searchSql);
    assert.ok(!isEmpty(res), new XError(30000, '同步服务不存在'));
    return res;
  }
};
