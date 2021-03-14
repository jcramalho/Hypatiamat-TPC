"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findProfTurmas(ctx) {
    const { idprofessor } = ctx.params;

    const entity = await strapi.services.turma.find({ idprofessor });
    return sanitizeEntity(entity, { model: strapi.models.turma });
  },
};
