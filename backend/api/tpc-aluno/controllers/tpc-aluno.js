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
  async findAlunoTpcs(ctx) {
    const { codAluno } = ctx.params;

    const entity = await strapi.services["tpc-aluno"].findOne({ codAluno });

    if (!entity) return ctx.send("Not Found");

    let tpcs = entity.tpcs;
    let resolucoes = entity.resolucoes;
    if (ctx.query.time === "active") {
      tpcs = tpcs.filter((tpc) => {
        return new Date(tpc.dataFim) > new Date();
      });

      for (const tpc of tpcs) {
        const nResol = resolucoes.filter((res) => {
          return res.idTpc === tpc.id;
        }).length;

        tpc.nResol = nResol;
      }
      tpcs.sort((a, b) => a.dataFim.localeCompare(b.dataFim));
    } else if (ctx.query.time === "expired") {
      tpcs = tpcs.filter((tpc) => {
        return new Date(tpc.dataFim) <= new Date();
      });
      tpcs.sort((a, b) => b.dataFim.localeCompare(a.dataFim));
    }
    return tpcs;
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
