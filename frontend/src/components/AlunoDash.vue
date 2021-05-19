<template>
  <v-container>
    <v-card class="mx-auto mb-5">
      <v-card-title> {{ name }} </v-card-title>
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
        <v-list v-if="tpcs.length > 0">
          <template v-for="item in tpcs">
            <v-list-item :key="item.id">
              <v-list-item-content>
                <v-list-item-title
                  ><b>{{ item.tagname }}</b></v-list-item-title
                >

                <b
                  ><span style="color:green;">Nº Tentativas: </span>
                  {{ tentativas(item) }}
                </b>
                <b
                  ><span style="color:#960000;">Data Limite: </span>
                  {{ dataFormat(item.dataFim) }}</b
                >
              </v-list-item-content>
              <div>
                <v-list-item-action>
                  <div v-if="podeFazer(item)">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          @click="fazerTpc(item)"
                          rounded
                          dark
                          color="#009263"
                          v-bind="attrs"
                          v-on="on"
                          >Resolver
                        </v-btn>
                      </template>
                      <span>Nova Tentativa</span>
                    </v-tooltip>
                  </div>
                  <div v-else>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-8"
                          large
                          color="green"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </template>
                      <span>TPC Resolvido</span>
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
const Swal = require("sweetalert2");
const host = require("@/config/hosts").hostAPI;

export default {
  async created() {
    await this.getUser();
    this.getEscola();
    this.getTpcs();
  },
  computed: {
    noTpcs() {
      if (this.tpcsFlag === "loading") return "";
      return this.tpcsFlag;
    },
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
      tpcsFlag: "loading",
    };
  },
  methods: {
    podeFazer(tpc) {
      if (tpc.nResol === tpc.tentativas) return false;
      return true;
    },
    tentativas(tpc) {
      return `${tpc.nResol}/${tpc.tentativas}`;
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
    fazerTpc(tpc) {
      if (tpc.nResol > 0)
        Swal.fire({
          title: "Realizar Nova Tentativa?",
          text:
            "Já submeteu uma tentativa de resolução do TPC, uma nova tentativa irá descartar a anterior.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#009263",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed)
            this.$router.push({ name: "DoTpc", params: { id: tpc.id } });
        });
      else this.$router.push({ name: "DoTpc", params: { id: tpc.id } });
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
          host + "tpc-alunos/" + this.user.user + "/tpcs?time=active"
        );
        if (tpcsAluno.data !== "Not Found") {
          let tpcs = tpcsAluno.data;
          this.tpcs = tpcs;
          this.tpcsFlag = "";
        }
        if (this.tpcs.length === 0)
          this.tpcsFlag = "De momento não tem TPCs ativos.";
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch TPCs");
        throw error;
      }
    },
  },
};
</script>

<style></style>
