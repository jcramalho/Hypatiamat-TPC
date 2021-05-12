"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const anoletivo = require("../../../config/confs").anoletivo;

module.exports = {
  async findProfTurmas(ctx) {
    const { idprofessor } = ctx.params;

    const entities = await strapi.services.turma.find({
      idprofessor,
      anoletivo,
    });

    const turmas = {};

    for (const el of entities) {
      let alunos = await strapi.services.aluno.find({
        turma: el.turma,
        codprofessor: idprofessor,
      });
      if (alunos.length > 0) {
        alunos.sort((a, b) => a.nome.localeCompare(b.nome));
        turmas[el.turma] = alunos;
      }
    }

    return turmas;
  },
};
