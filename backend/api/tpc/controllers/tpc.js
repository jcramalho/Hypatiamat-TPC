"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findProfTpcs(ctx) {
    const { codProf } = ctx.params;

    const entity = await strapi.services.tpc.find({ codProf });
    return sanitizeEntity(entity, { model: strapi.models.tpc });
  },
};
