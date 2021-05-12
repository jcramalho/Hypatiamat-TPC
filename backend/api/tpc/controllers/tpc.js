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

    let tpcs = [];
    for (const tpc of entity) {
      const totalAlunos = tpc["tpc_alunos"].length;
      let totalResp = 0;

      for (const al of tpc["tpc_alunos"]) {
        const aluno = await strapi.services["tpc-aluno"].findOne({
          codAluno: al.codAluno,
        });

        const temResol = aluno.resolucoes.find((el) => el.idTpc === tpc.id);

        if (temResol) totalResp += 1;
      }

      tpc.totalAlunos = totalAlunos;
      tpc.totalResp = totalResp;
      tpcs.push(tpc);
    }
    return sanitizeEntity(tpcs, { model: strapi.models.tpc });
  },
};
