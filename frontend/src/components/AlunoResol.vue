<template>
  <v-card>
    <v-container>
      <v-row class="mt-n4">
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
                  <span>{{ q.cod }}</span>
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-text-field
            color="#009263"
            v-model="tema"
            readonly
            label="Tema"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-text-field
            color="#009263"
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
            height="520px"
          >
            <v-row>
              <v-col cols="12" xs="8" sm="8" md="8" lg="8" xl="8">
                <v-row>
                  <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                    <h2 style="color:#009263" class="text-center my-2">
                      Questão
                    </h2>

                    <div
                      v-html="questaoAtual"
                      class="mt-5 ml-10 bodyText"
                    ></div>

                    <div class="mt-5 ml-8">
                      <v-container v-if="tipoQuestao === 2">
                        <v-radio-group v-model="respostaAluno" disabled>
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
                              >
                                <v-radio
                                  color="#009263"
                                  :label="`${index + 1})`"
                                  :value="resp"
                                >
                                </v-radio>
                              </v-img>
                            </v-col>
                          </v-row>
                        </v-radio-group>
                      </v-container>
                      <div
                        class="resposta mt-8 text-start"
                        v-else-if="tipoQuestao === 1"
                      >
                        <div class="input">
                          <span> {{ respostaAluno }} </span>
                          <span class="unidade" v-html="unidade"></span>
                        </div>
                      </div>
                      <v-container v-else class="mt-n6" fluid>
                        <v-radio-group v-model="respostaAluno" disabled>
                          <v-radio
                            color="#009263"
                            v-for="(resp, index) in respostas"
                            :key="index"
                            :value="resp"
                          >
                            <template slot="label">
                              <span v-html="resp"></span>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </v-container>
                    </div>
                    <v-container class="text-center mt-n4 bodyText">
                      <span v-if="respCorreta === 1">
                        <b> Correta: </b>
                        <v-icon x-large color="green">
                          mdi-checkbox-marked-circle
                        </v-icon></span
                      >
                      <span v-else-if="respCorreta === 0">
                        <b>Correta: </b>
                        <v-icon x-large color="red">
                          mdi-close-circle
                        </v-icon></span
                      >
                    </v-container>
                  </v-col>
                </v-row>
                <v-row style="position:absolute; bottom:0;">
                  <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
                    <div class="pt-6 my-2 mx-2">
                      <v-dialog v-model="dialogResol" width="600px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            small
                            :style="{
                              left: '50%',
                              transform: 'translateX(-50%)',
                            }"
                            class="white--text"
                            color="#009263"
                            v-bind="attrs"
                            v-on="on"
                          >
                            Resolução
                          </v-btn>
                        </template>
                        <v-card>
                          <v-img contain :src="resolucao"></v-img>
                          <v-card-actions class="text-center">
                            <v-btn
                              :style="{
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }"
                              color="#009263"
                              text
                              @click="dialogResol = false"
                            >
                              OK
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
                <div id="info">
                  <span> <b> Código: </b> {{ codQuestao }}</span>
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
    </v-container>
  </v-card>
</template>

<script>
const axios = require("axios");
const host = require("@/config/hosts").hostAPI;

export default {
  props: ["codAluno", "tpcId"],
  created() {
    this.getTemas();
    this.getResol();
  },
  data() {
    return {
      dialogResol: false,
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
    respCorreta() {
      if (
        !this.catalogoQuestoes[this.counter] ||
        Object.keys(this.opcoesSelected).length === 0
      )
        return "";

      const codQuestao = this.catalogoQuestoes[this.counter].cod;
      return this.opcoesSelected[codQuestao].correta;
    },
    respostaAluno() {
      if (
        !this.catalogoQuestoes[this.counter] ||
        Object.keys(this.opcoesSelected).length === 0
      )
        return "";

      const codQuestao = this.catalogoQuestoes[this.counter].cod;
      return this.opcoesSelected[codQuestao].resposta;
    },
    resolucao() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      let img = this.catalogoQuestoes[this.counter].resolucao;
      img = img ? `/imagens/propresolucao/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    codQuestao() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].cod;
    },
    unidade() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      return this.catalogoQuestoes[this.counter].unidade;
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
    questaoSelected(q, ind) {
      this.counter = ind;
      this.showRespostas();
      this.getTema();
    },
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
    async getResol() {
      try {
        const tpcData = await axios.get(host + "tpcs/" + this.tpcId);

        this.tpc = tpcData.data;
        const questoesCod = tpcData.data["tpc_questoes"];
        for (const q of questoesCod) {
          const questao = await axios.get(host + "exercicios/" + q.codQuestao);

          this.catalogoQuestoes.push(questao.data);
          this.getRespostas(questao.data);
        }
        this.showRespostas();
        this.getTema();

        // getResolucao Aluno
        const aluno = await axios.get(host + "tpc-alunos/" + this.codAluno);

        // Ultima tentativa de resolucao
        const resolucao = aluno.data.resolucoes
          .filter((r) => r.idTpc === this.tpcId)
          .reduce((a, b) => (a.data > b.data ? a : b), {});

        if (Object.keys(resolucao).length !== 0) {
          const resol = await axios.get(host + "resolucoes/" + resolucao.id);

          resol.data.respostas.forEach((resp) => {
            this.$set(this.opcoesSelected, resp.codQuestao, resp);
          });
        }
      } catch (err) {
        const error = new Error(err.message || "Failed to fetch Resolucao");
        throw error;
      }
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
      this.catalogoRespostas[questao.cod] = respostas;
    },
  },
};
</script>

<style scoped>
.bodyText {
  font-size: 16px;
}

.input {
  background-color: white;
  border: 2px solid #009263;
  box-shadow: 1px 1px 1px 0 lightgray inset;
  margin-top: 5px;
  margin-bottom: 20px;
  margin-left: 5px;
  padding: 2px 8px;
  width: 550px;
  height: 50px;
  line-height: 45px;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: auto;
  font-size: 16px;
}

.unidade {
  float: right;
  vertical-align: middle;
}

.resposta {
  width: 700px;
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
