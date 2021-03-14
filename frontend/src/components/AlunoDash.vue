<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> Aluno - {{ name }} </v-card-title>
      <v-card-text>
        {{ escolaName }}
      </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title>
        TPCs ativos
      </v-card-title>
      <v-card-text>
        <ul>
          <li>TP1</li>
          <li>TPC2</li>
          <li>TPC3</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-row justify="space-around" class="mt-5">
          <v-btn to="/historic" dark color="#008a5d" x-large>
            Histórico
          </v-btn>
          <v-btn to="/stats" dark color="#008a5d" x-large>
            Estatísticas
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
const axios = require("axios");

export default {
  computed: {
    name() {
      return this.user.nome;
    },
    escolaName() {
      return this.escola;
    },
  },
  created() {
    this.getUser();
    this.getEscola();
  },
  data() {
    return {
      user: null,
      escola: null,
    };
  },
  methods: {
    getUser() {
      this.user = this.$store.getters.getUser;
    },
    async getEscola() {
      const url = "http://localhost:1337";

      try {
        const response = await axios.get(url + "/escolas/" + this.user.escola);
        this.escola = response.data.nome;
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch Escola");
        throw error;
      }
    },
  },
};
</script>

<style></style>
