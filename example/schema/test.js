const Joi = require('@hapi/joi');

module.exports = {
  list: {
    query: Joi.object().keys({
      query: Joi.string(),
    }),
  },
};
