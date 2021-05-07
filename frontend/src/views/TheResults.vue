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
          class="elevation-1"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-dialog
              content-class="elevation-0"
              :retain-focus="false"
              v-model="dialogResp"
              width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="verResolucao(item.codAluno)"
                  v-on="on"
                  small
                  dark
                  color="#009263"
                  >Respostas</v-btn
                >
              </template>

              <v-card>
                <v-card-title class="headline green">
                  Respostas
                </v-card-title>

                <v-card-text>
                  <br />
                  <ul>
                    <li v-for="(resp, index) in respostas" :key="index">
                      Questão: {{ resp.codQuestao }} | Resposta:
                      {{ resp.resposta }} | Correta?: {{ resp.correta }}
                    </li>
                  </ul>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green" text @click="dialogResp = false">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template></v-data-table
        >
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
      respostas: [],
      dialogResp: false,
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
        { text: "Respostas", value: "action" },
      ],
      results: [],
    };
  },
  computed: {},
  methods: {
    async verResolucao(codAluno) {
      try {
        this.respostas = [];
        const aluno = await axios.get(host + "tpc-alunos/" + codAluno);

        const resolId = aluno.data.resolucoes.filter((el) => {
          return el.idTpc === this.id;
        })[0].id;

        const resolucao = await axios.get(host + "resolucoes/" + resolId);

        this.respostas = resolucao.data.respostas;
      } catch (err) {
        const error = new Error(err.message || "Failed to query Respostas");
        throw error;
      }
    },
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
