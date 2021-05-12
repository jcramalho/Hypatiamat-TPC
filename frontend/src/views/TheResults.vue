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
          :footer-props="{
            'items-per-page-text': 'Mostrar',
            'items-per-page-options': [30, 60, -1],
            'items-per-page-all-text': 'Todos',
          }"
          dense
          :headers="headers"
          :items="results"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-dialog
              content-class="elevation-0"
              :retain-focus="false"
              v-model="dialogResp"
              width="1000px"
            >
              <v-card>
                <v-card-title
                  style="background-color: #009263;"
                  class="white--text"
                >
                  Aluno: {{ atualAlunoNome }}
                </v-card-title>

                <v-card-text>
                  <AlunoResol
                    v-if="dialogResp"
                    :tpcId="id"
                    :codAluno="atualAlunoCod"
                  />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="justify-center">
                  <v-btn color="#009263" text @click="dialogResp = false">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn
              @click="verResolucao(item)"
              icon
              class="ml-4"
              small
              dark
              color="#009263"
            >
              <v-icon large>
                mdi-magnify
              </v-icon></v-btn
            >
          </template>
        </v-data-table>
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

import AlunoResol from "../components/AlunoResol.vue";

export default {
  props: ["id"],
  components: {
    AlunoResol,
  },
  created() {
    this.getUserId();
    this.getResults();
  },
  data() {
    return {
      atualAlunoNome: "",
      atualAlunoCod: null,
      respostas: [],
      dialogResp: false,
      userId: null,
      headers: [
        {
          text: "Aluno",
          align: "start",
          value: "nome",
        },
        { text: "Turma", value: "codTurma" },
        { text: "Q. Respondidas", value: "qRespondidas" },
        { text: "Q. Corretas", value: "qCertas" },
        { text: "Classificação", value: "classificacao" },

        { text: "Respostas", value: "action", sortable: false },
      ],
      results: [],
    };
  },
  computed: {},
  methods: {
    verResolucao(aluno) {
      this.atualAlunoCod = aluno.codAluno;
      this.atualAlunoNome = aluno.nome;
      this.dialogResp = true;
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
              nome: al.nome,
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
