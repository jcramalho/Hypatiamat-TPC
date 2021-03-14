"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.tema.search(ctx.query);
    } else {
      entities = await strapi.services.tema.find(ctx.query);
    }

    let result = entities.reduce(function (list, t) {
      list[t.codtema] = list[t.codtema] || [];
      list[t.codtema].push({
        tema: t.tema,
        subtema: t.subtema,
        codsubtema: t.codsubtema,
      });
      return list;
    }, Object.create(null));

    return result;
  },
};
