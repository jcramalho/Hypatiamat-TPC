/* eslint-disable quotes */
"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findOne(ctx) {
    const { codigo } = ctx.params;

    const entity = await strapi.services.professor.findOne({ codigo });
    return sanitizeEntity(entity, { model: strapi.models.professor });
  },
};
