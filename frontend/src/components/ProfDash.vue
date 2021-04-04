<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title>
        {{ name }}
      </v-card-title>
      <v-card-text>
        {{ escola }}
      </v-card-text>
    </v-card>
    <v-card class="mx-auto pb-5">
      <v-card-title>
        TPCs ativos
      </v-card-title>
      <v-card-text>
        <ul>
          <li v-for="(tpc, index) in tpcs" :key="index">{{ tpc }}</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-row justify="space-around" class="mt-5">
          <v-btn to="/create" dark color="#008a5d" x-large>Criar TPC</v-btn>
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
import axios from "axios";
const url = require("@/config/hosts").hostAPI;

export default {
  created() {
    this.getUser();
    this.getEscola();
    this.getTpcs();
  },
  data() {
    return {
      tpcs: [],
      user: null,
      escola: null,
    };
  },
  computed: {
    name() {
      return this.user.nome;
    },
    escolaName() {
      return this.escola;
    },
  },
  methods: {
    async getTpcs() {
      try {
        const response = await axios.get(url + "tpcs/prof/" + this.user.codigo);
        this.tpcs = response.data;
        console.log(response.data);
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
    getUser() {
      this.user = this.$store.getters.getUser;
    },
    async getEscola() {
      try {
        const response = await axios.get(url + "escolas/" + this.user.escola);
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
