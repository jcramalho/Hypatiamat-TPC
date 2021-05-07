"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async create(ctx) {
    const existentEntity = await strapi.services["tpc-aluno"].findOne({
      codAluno: ctx.request.body.codAluno,
    });

    if (existentEntity !== null)
      return sanitizeEntity(existentEntity, {
        model: strapi.models["tpc-aluno"],
      });

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["tpc-aluno"].create(data, {
        files,
      });
    } else {
      entity = await strapi.services["tpc-aluno"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["tpc-aluno"] });
  },
  async findOne(ctx) {
    const { codAluno } = ctx.params;

    const entity = await strapi.services["tpc-aluno"].findOne({ codAluno });

    if (!entity) return ctx.send("Not Found");

    return sanitizeEntity(entity, { model: strapi.models["tpc-aluno"] });
  },

  async update(ctx) {
    const { codAluno } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["tpc-aluno"].update({ codAluno }, data, {
        files,
      });
    } else {
      entity = await strapi.services["tpc-aluno"].update(
        { codAluno },
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models["tpc-aluno"] });
  },
};
