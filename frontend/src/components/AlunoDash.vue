<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> Aluno - {{ name }} </v-card-title>
      <v-card-text>
        {{ escolaName }}
      </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title class="justify-center green--text">
        <h2>
          TPCs Ativos
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
                  <span
                    >Tentativas: {{ item.tentativas }}, Data Limite:
                    {{ item.dataFim }}</span
                  >
                </v-list-item-content>
                <div>
                  <v-list-item-action>
                    <v-btn
                      @click="fazerTpc(item.id)"
                      rounded
                      dark
                      color="#009263"
                      >Fazer TPC</v-btn
                    >
                  </v-list-item-action>
                </div>
              </v-list-item>
              <v-divider :key="`div${item.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-row justify="space-around" class="mt-5">
          <v-btn to="/historic" dark color="#009263" x-large>
            Histórico
          </v-btn>
          <v-btn to="/stats" dark color="#009263" x-large>
            Estatísticas
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
  async created() {
    await this.getUser();
    this.getEscola();
    this.getTpcs();
  },
  computed: {
    name() {
      if (!this.user) return "";
      return this.user.nome;
    },
    escolaName() {
      return this.escola;
    },
  },
  data() {
    return {
      tpcs: [],
      user: null,
      escola: null,
    };
  },
  methods: {
    fazerTpc(id) {
      this.$router.push({ name: "DoTpc", params: { id } });
    },
    async getUser() {
      try {
        const userId = this.$store.getters.getUserId;
        const aluno = await axios.get(host + "alunos/" + userId);
        this.user = aluno.data;
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch User");
        throw error;
      }
    },
    async getEscola() {
      try {
        const response = await axios.get(host + "escolas/" + this.user.escola);
        this.escola = response.data.nome;
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch Escola");
        throw error;
      }
    },
    async getTpcs() {
      try {
        const tpcsAluno = await axios.get(
          host + "tpc-alunos/" + this.user.user
        );
        let tpcs = tpcsAluno.data.tpcs;
        const resolucoes = tpcsAluno.data.resolucoes;

        // Filtrar TPCs por fazer apenas (sem resol)
        for (const res of resolucoes) {
          tpcs = tpcs.filter((tpc) => tpc.id !== res.idTpc);
        }
        this.tpcs = tpcs;
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
  },
};
</script>

<style></style>
