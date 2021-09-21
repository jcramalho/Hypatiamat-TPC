"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.appstabletpc.search(ctx.query);
    } else {
      entities = await strapi.services.appstabletpc.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.appstabletpc })
    );
  },

  // Criar/update entrada em tabela
  async create(ctx) {
    let check = await strapi.services.appstabletpc.checkTableEntry(
      ctx.request.body
    );

    let info;
    // verificar se ja existe entrada
    if (check.length === 0)
      // post
      info = await strapi.services.appstabletpc.createTableEntry(
        ctx.request.body
      );
    else {
      // update
      info = await strapi.services.appstabletpc.updateTableEntry(
        check[0],
        ctx.request.body
      );
    }
    return info;
  },
};
