"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findProfTurmas(ctx) {
    const { idprofessor } = ctx.params;

    const entities = await strapi.services.turma.find({ idprofessor });

    const turmas = {};

    for (const el of entities) {
      let alunos = await strapi.services.aluno.find({ turma: el.turma });

      turmas[el.turma] = alunos;
    }

    return turmas;
  },
};
