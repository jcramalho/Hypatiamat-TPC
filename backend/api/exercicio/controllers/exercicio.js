"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.exercicio.search(ctx.query);
    } else {
      entities = await strapi.services.exercicio.find(ctx.query);
    }
    entities = await strapi.services.exercicio.specialChars(entities);

    let result = entities.reduce(function (list, ex) {
      list[ex.subtema] = list[ex.subtema] || [];
      list[ex.subtema].push({
        ...ex,
      });
      return list;
    }, Object.create(null));

    return result;
  },
};
