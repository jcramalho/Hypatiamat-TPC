<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> Professor {{ userId }}</v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title class="justify-center green--text">
        <h2>Resultados TPC {{ this.id }}</h2>
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :headers="headers"
          :items="results"
          item-key="codAluno"
          class="elevation-1"
        ></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-row justify="start" class="mt-5 ml-4">
          <v-btn to="/dashboard" dark color="#009263" x-large>
            Voltar
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
const axios = require("axios");
const host = require("@/config/hosts").hostAPI;

export default {
  props: ["id"],
  created() {
    this.getUserId();
    this.getResults();
  },
  data() {
    return {
      userId: null,
      headers: [
        {
          text: "Aluno",
          align: "start",
          sortable: false,
          value: "codAluno",
        },
        { text: "Turma", value: "codTurma" },
        { text: "qRespondidas", value: "qRespondidas" },
        { text: "qCertas", value: "qCertas" },
        { text: "classificação", value: "classificacao" },
      ],
      results: [],
    };
  },
  computed: {},
  methods: {
    async getResults() {
      try {
        const tpcs = await axios.get(host + "tpcs/" + this.id);

        const alunos = tpcs.data["tpc_alunos"];

        for (const al of alunos) {
          const aluno = await axios.get(host + "tpc-alunos/" + al.codAluno);

          const resolucoes = aluno.data.resolucoes.filter(
            (r) => r.idTpc === this.id
          );
          if (resolucoes.length !== 0) {
            this.results.push({
              codAluno: al.codAluno,
              codTurma: al.codTurma,
              qRespondidas: resolucoes[0].qRespondidas,
              qCertas: resolucoes[0].qCertas,
              classificacao: resolucoes[0].classificacao,
            });
          }
        }
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
    getUserId() {
      this.userId = this.$store.getters.getUserId;
    },
  },
};
</script>

<style></style>
