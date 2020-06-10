import base from './base';
import dev from './dev';
import daily from './daily';
import production from './prod';

export default {
  ...base,
  ...{
    dev,
    daily,
    production,
  }[process.env.NODE_ENV || 'dev'],
};
