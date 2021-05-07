<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> Aluno - {{ name }} </v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title class="justify-center green--text">
        <h2>
          TPCs Realizados
        </h2>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item-group color="#009263">
            <template v-for="item in tpcs">
              <v-list-item :key="item.id">
                <v-list-item-content>
                  <v-list-item-title
                    ><b>{{ item.tagname }}</b></v-list-item-title
                  >
                  <span>Classificação: {{ classificacao(item.id) }}</span>
                </v-list-item-content>
                <div>
                  <v-list-item-action>
                    <v-btn rounded dark color="#009263">Ver</v-btn>
                  </v-list-item-action>
                </div>
              </v-list-item>
              <v-divider :key="`div${item.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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
  created() {
    this.getUserId();
    this.getTpcs();
  },
  computed: {
    name() {
      return this.userId;
    },
  },
  data() {
    return {
      tpcs: [],
      resolucoes: [],
      userId: null,
    };
  },
  methods: {
    classificacao(idTpc) {
      return this.resolucoes
        .filter((r) => r.idTpc === idTpc)
        .map((r) => r.classificacao)[0];
    },
    async getTpcs() {
      try {
        const tpcsAluno = await axios.get(host + "tpc-alunos/" + this.userId);

        if (tpcsAluno.data !== "Not Found") {
          let tpcs = tpcsAluno.data.tpcs;
          const resolucoes = tpcsAluno.data.resolucoes;

          // Filtrar TPCs feitos (com resol)
          const resolsId = resolucoes.map((r) => r.idTpc);
          tpcs = tpcs.filter((tpc) => resolsId.includes(tpc.id));
          this.tpcs = tpcs;
          this.resolucoes = resolucoes;
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

<style scoped></style>
