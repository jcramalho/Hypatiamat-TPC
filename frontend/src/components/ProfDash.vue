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

                  <b
                    ><span style="color:green;">Nº Respostas: </span>
                    {{ respFormat(item) }}
                  </b>
                  <b
                    ><span style="color:#960000;">Data Limite: </span>
                    {{ dataFormat(item.dataFim) }}</b
                  >
                </v-list-item-content>
                <div>
                  <v-list-item-action
                    :style="{
                      transform: 'translateY(20%) translateX(40%)',
                    }"
                  >
                    <v-btn icon @click="checkTPC(item.id)" dark color="#009263">
                      <v-icon large>
                        mdi-magnify
                      </v-icon></v-btn
                    >
                  </v-list-item-action>

                  <v-list-item-action>
                    <v-btn
                      @click="results(item.id)"
                      rounded
                      dark
                      color="#009263"
                      >Resultados</v-btn
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
const axios = require("axios");
const host = require("@/config/hosts").hostAPI;

export default {
  async created() {
    await this.getUser();
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
      if (!this.user) return "";
      return this.user.nome;
    },
    escolaName() {
      return this.escola;
    },
  },
  methods: {
    respFormat(tpc) {
      return `${tpc.totalResp}/${tpc.totalAlunos}`;
    },
    dataFormat(datetime) {
      let date = new Date(datetime);

      return `${date.getDate()}-${date.getMonth() +
        1}-${date.getFullYear()} ● ${date.getHours()}h${date.getMinutes()}`;
    },
    checkTPC(id) {
      this.$router.push({ name: "SeeTPC", params: { id } });
    },
    results(id) {
      this.$router.push({ name: "TheResults", params: { id } });
    },
    async getUser() {
      try {
        const userId = this.$store.getters.getUserId;
        const prof = await axios.get(host + "professores/" + userId);
        this.user = prof.data;
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
        const response = await axios.get(
          host + "tpcs/prof/" + this.user.codigo
        );
        this.tpcs = response.data;
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
  },
};
</script>

<style></style>
