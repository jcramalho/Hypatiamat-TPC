<template>
  <v-card class="pa-5">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
          <v-card-title class="justify-center green--text">
            <h1>TPC - {{ titulo }}</h1>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <span></span>
      </v-row>
      <v-row class="my-n4">
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
          <v-sheet>
            <v-slide-group mandatory show-arrows center-active>
              <v-slide-item
                v-for="(q, index) in catalogoQuestoes"
                :key="index"
                v-slot="{ active, toggle }"
              >
                <v-chip
                  color="#009263"
                  ref="chips"
                  large
                  dark
                  class="mx-2"
                  :input-value="active"
                  active-class="black--text"
                  @click="toggle"
                  v-on:click="questaoSelected(q, index)"
                >
                  <span>
                    <b>{{ q.cod }}</b>
                  </span>
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-text-field
            v-model="tema"
            readonly
            label="Tema"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-text-field
            v-model="subtema"
            readonly
            label="Subtema"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
          <v-card
            class="mt-n12 mx-auto"
            color="white"
            elevation="2"
            outlined
            rounded
          >
            <v-row>
              <v-col cols="12" xs="8" sm="8" md="8" lg="8" xl="8">
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                    <h2 style="color:#009263" class="text-center my-2">
                      Questão
                    </h2>

                    <div v-html="questaoAtual" class="mt-5 ml-10"></div>

                    <div class="mt-5 ml-8">
                      <v-container v-if="tipoQuestao === 2">
                        <v-radio-group v-model="opcoesSelected[codQuestao]">
                          <v-row>
                            <v-col
                              v-for="(resp, index) in respostas"
                              :key="index"
                              cols="3"
                              xs="3"
                              sm="3"
                              md="3"
                              lg="3"
                              xl="5"
                            >
                              <v-img
                                height="200px"
                                width="200px"
                                contain
                                :src="imgRespostas(resp)"
                                ><v-radio color="#009263" :value="resp">
                                  <template slot="label">
                                    <span class="black--text"
                                      >{{ index + 1 }})</span
                                    >
                                  </template>
                                </v-radio></v-img
                              >
                            </v-col>
                          </v-row>
                        </v-radio-group>
                      </v-container>
                      <div
                        class="resposta mt-8 text-start"
                        v-else-if="tipoQuestao === 1"
                      >
                        <div class="input">
                          <span v-html="opcoesSelected[codQuestao]"> </span>
                          <span class="unidade" v-html="unidade"></span>
                        </div>

                        <SimpleKeyboard
                          @onChange="onChange"
                          :input="opcoesSelected[codQuestao]"
                        />
                      </div>

                      <v-container class="mt-n6" v-else fluid>
                        <v-radio-group v-model="opcoesSelected[codQuestao]">
                          <v-radio
                            color="#009263"
                            v-for="(resp, index) in respostas"
                            :key="index"
                            :value="resp"
                          >
                            <template slot="label">
                              <span class="black--text" v-html="resp"></span>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </v-container>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
                <div id="info">
                  <span>
                    <b> {{ codQuestao }} </b>
                  </span>
                  <span
                    ><b>Nível {{ nivel }}</b></span
                  >
                </div>
                <v-card>
                  <v-img
                    height="400px"
                    width="400px"
                    contain
                    :src="imagem"
                  ></v-img>
                </v-card>
                <div v-if="temExame" id="exame">
                  <span> <b> Exame: </b> {{ exame }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-n4">
        <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container>
            <v-btn @click="voltar" large class="white--text" color="#009263"
              >Voltar</v-btn
            >
          </v-container>
        </v-col>
        <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container class="text-center">
            <v-btn
              @click="proxQuestao(false)"
              rounded
              class="mx-4"
              large
              dark
              color="#009263"
            >
              <v-icon large>
                mdi-arrow-left-bold-circle
              </v-icon>
            </v-btn>

            <v-btn
              @click="proxQuestao(true)"
              rounded
              class="mx-4"
              large
              dark
              color="#009263"
            >
              <v-icon large>
                mdi-arrow-right-bold-circle
              </v-icon>
            </v-btn>
          </v-container>
        </v-col>
        <v-col class="text-right" cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container>
            <v-btn
              @click="submeter"
              :disabled="podeSubmeter"
              large
              class="white--text"
              color="#009263"
              >Submeter</v-btn
            >
          </v-container>
        </v-col>
      </v-row></v-container
    >
  </v-card>
</template>

<script>
const axios = require("axios");
const Swal = require("sweetalert2");
const host = require("@/config/hosts").hostAPI;

import SimpleKeyboard from "../components/SimpleKeyboard.vue";

export default {
  components: {
    SimpleKeyboard,
  },
  props: ["id"],
  created() {
    this.getUserId();
    this.getQuestoes();
    this.getTemas();
  },
  data() {
    return {
      userId: null,
      tpc: null,
      catalogoQuestoes: [],
      catalogoRespostas: {},
      catalogoTemas: [],
      respostas: [],
      opcoesSelected: {},
      counter: 0,
      tema: "",
      subtema: "",
    };
  },
  computed: {
    podeSubmeter() {
      const nQuestoes = this.catalogoQuestoes.length;
      const qRespondidas = Object.keys(this.opcoesSelected).length;

      if (qRespondidas !== nQuestoes) return true;
      return false;
    },
    exame() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].idexame;
    },
    temExame() {
      if (
        this.catalogoQuestoes[this.counter] &&
        this.catalogoQuestoes[this.counter].idexame
      )
        return 1;
      return 0;
    },
    nivel() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].niveldificuldade;
    },
    titulo() {
      if (!this.tpc) return "";
      return this.tpc.tagname;
    },
    codQuestao() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].cod;
    },
    unidade() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].unidade;
    },
    tipoQuestao() {
      if (!this.catalogoQuestoes[this.counter]) return 0;

      return this.catalogoQuestoes[this.counter].tipo;
    },
    questaoAtual() {
      if (!this.catalogoQuestoes[this.counter]) return "";

      return this.catalogoQuestoes[this.counter].questao;
    },
    imagem() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      let img = this.catalogoQuestoes[this.counter].figura;
      img = img ? `/imagens/${img.replace(".swf", "")}.png` : "";
      return img;
    },
  },
  methods: {
    async getTemas() {
      try {
        const response = await axios.get(host + "temas");

        Object.keys(response.data).forEach((el) => {
          let tema = response.data[el][0].tema;
          let subtemas = [];
          response.data[el].forEach((item) => {
            subtemas.push({
              codsubtema: item.codsubtema,
              subtema: item.subtema,
            });
          });

          this.catalogoTemas.push({ codtema: el, tema: tema, subtemas });
        });
      } catch (err) {
        const error = new Error(err.message || "Failed to query Temas");
        throw error;
      }
    },
    getTema() {
      const questao = this.catalogoQuestoes[this.counter];

      const temaEntry = this.catalogoTemas.filter((el) => {
        return el.codtema === questao.tema;
      })[0];

      this.tema = temaEntry.tema;

      const subtemaEntry = temaEntry.subtemas.filter((el) => {
        return el.codsubtema === questao.subtema;
      })[0];

      this.subtema = subtemaEntry.subtema;
    },
    // Keyboard method
    onChange(input) {
      const cod = this.catalogoQuestoes[this.counter].cod;
      this.$set(this.opcoesSelected, cod, input);
    },

    // Submeter Resol. TPC
    async submeter() {
      try {
        Swal.fire({
          title: "Submeter TPC?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#009263",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Loading modal
            Swal.fire({
              title: "A submeter TPC...",
              showConfirmButton: false,
              allowOutsideClick: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            const resps = [];
            for (let [cod, resp] of Object.entries(this.opcoesSelected)) {
              const questao = this.catalogoQuestoes.filter(
                (el) => el.cod === cod
              )[0];

              //Verificar se resposta é igual a soluçao
              let correta = 0;
              //Resp Aberta
              if (questao.tipo === 1) {
                switch (questao.auxiliar) {
                  case 0:
                    for (let i = 1; i < 7; i++) {
                      if (
                        questao[`resposta${i}`] !== "" &&
                        questao[`resposta${i}`] === resp
                      ) {
                        correta = 1;
                        break;
                      }
                    }
                    break;
                  case 22:
                    correta =
                      resp === `${questao.resposta1}/${questao.resposta2}`
                        ? 1
                        : 0;
                    break;
                  case 1000:
                    if (
                      questao.resposta1 === resp ||
                      questao.resposta2 === resp
                    )
                      correta = 1;
                    break;
                }

                // Escolha Multipla
              } else {
                correta = questao.resposta1 === resp ? 1 : 0;
              }

              //----------- Criar resposta
              let bodyResp = {
                codQuestao: questao.cod,
                resposta: resp,
                correta,
              };

              const resposta = await axios.post(host + "respostas", bodyResp);

              resps.push(resposta.data);
            }

            // ------------- Criar resolucao
            const qRespondidas = this.catalogoQuestoes.length;
            const qCertas = resps.filter((r) => r.correta === 1).length;
            const classificacao = (qCertas / qRespondidas) * 100;
            const respostas = resps.map((r) => r.id);

            let bodyResol = {
              idTpc: this.id,
              qRespondidas,
              qCertas,
              questaoAtual: "",
              classificacao: classificacao.toFixed(2),
              respostas,
              data: new Date(),
            };

            const resolucao = await axios.post(host + "resolucoes", bodyResol);

            const resolsAluno = await axios.get(
              host + "tpc-alunos/" + this.userId
            );

            let allResol = resolsAluno.data.resolucoes.map((resol) => resol.id);

            allResol.push(resolucao.data.id);

            await axios.put(host + "tpc-alunos/" + this.userId, {
              resolucoes: allResol,
            });

            Swal.close();
            Swal.fire({
              icon: "success",
              title: "TPC submetido com sucesso!",
              confirmButtonColor: "#009263",
            });
            this.$router.replace("/dashboard");
          }
        });
      } catch (err) {
        const error = new Error(err.message || "Failed to post Resolucao");
        throw error;
      }
    },
    proxQuestao(flag) {
      const nQuestoes = this.catalogoQuestoes.length;
      if (flag) {
        if (this.counter + 1 < nQuestoes) this.counter++;
      } else {
        if (this.counter - 1 >= 0) this.counter--;
      }
      this.$refs.chips[this.counter].click();
    },
    imgRespostas(img) {
      img = img ? `/imagens/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    showRespostas() {
      this.respostas = [];

      const questao = this.catalogoQuestoes[this.counter];
      if (!questao) return;
      this.catalogoRespostas[questao.cod].forEach((el) => {
        this.respostas.push(el);
      });
    },
    getRespostas(questao) {
      let respostas = [];
      if (!questao) return;
      switch (questao.tipo) {
        case 0:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          respostas.push(questao.resposta4);
          break;
        // Resp. aberta
        case 1:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          respostas.push(questao.resposta4);
          respostas.push(questao.resposta5);
          respostas.push(questao.resposta6);
          break;
        case 2:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          respostas.push(questao.resposta4);
          break;
        case 3:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          break;
        case 4:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          break;
        case 5:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          respostas.push(questao.resposta4);
          respostas.push(questao.resposta5);
          break;
        case 6:
          respostas.push(questao.resposta1);
          respostas.push(questao.resposta2);
          respostas.push(questao.resposta3);
          respostas.push(questao.resposta4);
          respostas.push(questao.resposta5);
          respostas.push(questao.resposta6);
          break;
      }
      if (questao.tipo !== 1) respostas = this.shuffle(respostas);
      this.catalogoRespostas[questao.cod] = respostas;
    },
    // Durstenfeld shuffle array
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    questaoSelected(q, ind) {
      this.counter = ind;
      this.showRespostas();
      this.getTema();
    },
    getUserId() {
      this.userId = this.$store.getters.getUserId;
    },
    async getQuestoes() {
      try {
        const tpcData = await axios.get(host + "tpcs/" + this.id);
        const questoesCod = tpcData.data["tpc_questoes"];
        this.tpc = tpcData.data;
        for (const q of questoesCod) {
          const questao = await axios.get(host + "exercicios/" + q.codQuestao);

          this.catalogoQuestoes.push(questao.data);
          this.getRespostas(questao.data);
        }
        this.showRespostas();
        this.getTema();
      } catch (err) {
        const error = new Error(err.message || "Failed to query Questoes");
        throw error;
      }
    },
    voltar() {
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
.resposta {
  width: 700px;
}
.input {
  background-color: white;
  border: 2px solid #009263;
  box-shadow: 1px 1px 1px 0 lightgray inset;
  margin-top: 5px;
  margin-bottom: 20px;
  margin-left: 5px;
  padding: 2px 8px;
  width: 690px;
  height: 50px;
  line-height: 45px;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: auto;
}
.unidade {
  float: right;
  vertical-align: middle;
}
#info {
  height: 20px;
  line-height: 22px;
  padding: 5px 6px;
  font-size: 14px;
  margin-bottom: 15px;
}

#info span:last-child {
  position: absolute;
  right: 6px;
  color: #009263;
}

#exame {
  padding: 5px 10px;
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
