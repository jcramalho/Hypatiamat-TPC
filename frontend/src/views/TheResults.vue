<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
          <v-container>
            <v-card-title class="justify-center green--text">
              <h2>Resultados TPC: {{ this.tpcNome }}</h2>
            </v-card-title>
            <center>
              <v-btn v-if="!show" text @click="show = !show"
                ><span>Mostrar Ajuda</span
                ><v-icon color="#009263"> mdi-help-circle </v-icon>
              </v-btn>
              <v-btn v-else text @click="show = !show">Esconder Ajuda</v-btn>
            </center>
            <v-slide-y-transition>
              <v-card
                v-show="show"
                class="elevation-6 pa-3"
                style="border: 2px solid green !important;"
                color="grey lighten-3"
              >
                <v-row>
                  <v-col cols="12">
                    <span>
                      1. Esta página contém a tabela com os resultados dos
                      alunos que realizaram o TPC que selecionou. Pode ver
                      informações como o nome do <b>Aluno</b>, a <b>Turma</b>, o
                      nº de questões <b>Corretas</b> e a <b>Classificação</b> da
                      resolução do respetivo aluno.
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <span>
                      2. Para cada entrada da tabela, também pode ver as
                      respostas do aluno às questões do TPC ao clicar em
                      <v-btn icon dark color="#009263">
                        <v-icon>
                          mdi-magnify
                        </v-icon></v-btn
                      >. Estas respostas correspondem à última tentativa
                      realizada por parte do aluno, como resolução do TPC.
                    </span>
                  </v-col>
                </v-row>
              </v-card>
            </v-slide-y-transition>
            <v-card-text>
              <v-data-table
                no-data-text="Não existem resoluções"
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
                    max-width="1200px"
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
                <v-btn @click="voltar" dark color="#009263" x-large>
                  Voltar
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
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
      show: false,
      user: null,
      tpcNome: "",
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
    voltar() {
      window.history.length > 2
        ? this.$router.go(-1)
        : this.$router.push("/dashboard");
    },
    verResolucao(aluno) {
      this.atualAlunoCod = aluno.codAluno;
      this.atualAlunoNome = aluno.nome;
      this.dialogResp = true;
    },
    async getResults() {
      try {
        const tpcs = await axios.get(host + "tpcs/" + this.id);

        this.tpcNome = tpcs.data.tagname;

        const alunos = tpcs.data["tpc_alunos"];

        let ind = 0;
        for (const al of alunos) {
          const aluno = await axios.get(host + "tpc-alunos/" + al.codAluno);

          // Ultima tentativa de resolucao do aluno
          const resol = aluno.data.resolucoes
            .filter((r) => r.idTpc == this.id)
            .reduce((a, b) => (a.data > b.data ? a : b), {});

          if (Object.keys(resol).length > 0) {
            const result = {
              nome: al.nome,
              codAluno: al.codAluno,
              codTurma: al.codTurma,
              qRespondidas: resol.qRespondidas,
              qCertas: resol.qCertas,
              classificacao: resol.classificacao,
            };
            this.$set(this.results, ind, result);
            ind++;
          }
        }
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
    async getUserId() {
      this.userId = this.$store.getters.getUserId;

      const prof = await axios.get(host + "professores/" + this.userId);
      this.user = prof.data;
    },
  },
};
</script>

<style></style>
