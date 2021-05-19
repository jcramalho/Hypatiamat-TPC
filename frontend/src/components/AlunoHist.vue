<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> {{ nomeAluno }} </v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title class="justify-center green--text">
        <h2>
          TPCs Expirados
        </h2>
      </v-card-title>
      <v-card-text>
        <v-list v-if="tpcs.length > 0">
          <template v-for="item in tpcs">
            <v-list-item :key="item.id">
              <v-list-item-content>
                <v-list-item-title
                  ><b>{{ item.tagname }}</b></v-list-item-title
                >

                <b>
                  <span style="color:green;">Classificação: </span>
                  {{ classificacao(item.id) }}
                </b>
                <b
                  ><span style="color:#960000;">Expirou a: </span>
                  {{ dataFormat(item.dataFim) }}</b
                >
              </v-list-item-content>
              <div>
                <v-list-item-action>
                  <v-dialog
                    v-if="temResol(item.id)"
                    content-class="elevation-0"
                    :retain-focus="false"
                    v-model="dialogResp"
                    width="1000px"
                  >
                    <template #activator="{ on: dialog }">
                      <v-tooltip top>
                        <template #activator="{ on: tooltip }">
                          <v-btn
                            @click="verResolucao(item)"
                            icon
                            color="#009263"
                            dark
                            v-on="{ ...tooltip, ...dialog }"
                            ><v-icon x-large> mdi-magnify</v-icon></v-btn
                          >
                        </template>
                        <span>Ver Resolução</span>
                      </v-tooltip>
                    </template>

                    <v-card>
                      <v-card-title
                        style="background-color: #009263;"
                        class="white--text"
                      >
                        Aluno: {{ nomeAluno }}
                      </v-card-title>

                      <v-card-text>
                        <AlunoResol
                          v-if="dialogResp"
                          :tpcId="tpcAtual.id"
                          :codAluno="userId"
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
                  <div v-else>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon color="red" dark
                          ><v-icon x-large>mdi-close-circle</v-icon></v-btn
                        >
                      </template>
                      <span>Não Resolveu</span>
                    </v-tooltip>
                  </div>
                </v-list-item-action>
              </div>
            </v-list-item>
            <v-divider :key="`div${item.id}`"></v-divider>
          </template>
        </v-list>
        <v-container v-else>
          <h2 style="text-align: center;">
            {{ noTpcs }}
          </h2>
        </v-container>
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
  components: {
    AlunoResol,
  },
  created() {
    this.getUserId();
    this.getTpcs();
  },
  data() {
    return {
      tpcs: [],
      resolucoes: [],
      user: null,
      userId: null,
      dialogResp: false,
      tpcsFlag: "loading",
      tpcAtual: null,
    };
  },
  computed: {
    noTpcs() {
      if (this.tpcsFlag === "loading") return "";
      return this.tpcsFlag;
    },
    nomeAluno() {
      if (!this.user) return "";
      return this.user.nome;
    },
  },
  methods: {
    temResol(idTpc) {
      const resol = this.resolucoes.filter((r) => r.idTpc === idTpc);
      if (resol.length === 0) return false;
      return true;
    },
    verResolucao(tpc) {
      this.tpcAtual = tpc;

      this.dialogResp = true;
    },
    dataFormat(date) {
      const datetime = new Date(date);
      // data
      const month =
        (datetime.getMonth() + 1 < 10 ? "0" : "") + (datetime.getMonth() + 1);
      const day = (datetime.getDate() < 10 ? "0" : "") + datetime.getDate();

      const data = `${day}-${month}-${datetime.getFullYear()}`;

      // tempo
      const hours = (datetime.getHours() < 10 ? "0" : "") + datetime.getHours();
      const minutes =
        (datetime.getMinutes() < 10 ? "0" : "") + datetime.getMinutes();

      const tempo = `${hours}:${minutes}`;
      return `${data} ● ${tempo}`;
    },
    classificacao(idTpc) {
      const classif = this.resolucoes
        .filter((r) => r.idTpc === idTpc)
        .reduce((a, b) => (a.data > b.data ? a : b), {});
      if (Object.keys(classif).length === 0) return "Não Realizou";
      return classif.classificacao;
    },
    async getTpcs() {
      try {
        const tpcsAluno = await axios.get(
          host + "tpc-alunos/" + this.userId + "/tpcs?time=expired"
        );

        if (tpcsAluno.data !== "Not Found") {
          this.tpcs = tpcsAluno.data;

          const aluno = await axios.get(host + "tpc-alunos/" + this.userId);

          this.resolucoes = aluno.data.resolucoes;
          this.tpcsFlag = "";
        }

        if (this.tpcs.length === 0)
          this.tpcsFlag = "De momento não tem TPCs expirados.";
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
    async getUserId() {
      this.userId = this.$store.getters.getUserId;

      const aluno = await axios.get(host + "alunos/" + this.userId);
      this.user = aluno.data;
    },
  },
};
</script>

<style scoped></style>
