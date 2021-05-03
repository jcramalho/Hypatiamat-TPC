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
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
          <v-text-field
            color="#009263"
            outlined
            type="text"
            label="Título do TPC"
            class="mb-n6"
            readonly
            v-model="titulo"
          ></v-text-field>
        </v-col>
        <v-col class="text-end" cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
          <v-btn large class="white--text" color="#009263">
            <v-icon class="mr-1"> mdi-cog </v-icon> Configurações
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-n6">
        <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="12">
          <v-combobox
            color="#009263"
            chips
            clearable
            multiple
            outlined
            full-width
            readonly
            prefix="Turmas"
          >
            <template v-slot:selection="{ item }">
              <v-dialog v-model="turmaDialog" scrollable max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip dark color="#009263" v-bind="attrs" v-on="on" close>
                    <strong>{{ item }}</strong
                    >&nbsp;
                  </v-chip>
                </template>
                <v-card>
                  <v-card-title>Turma {{ item }}</v-card-title>
                  <v-card-text style="height: 300px;">
                    <v-list shaped>
                      <!-- <v-list-item-group multiple>
                        <template v-for="(item, ind) in alunos">
                          <v-list-item
                            :key="ind"
                            :value="item"
                            active-class="#009263"
                          >
                            <template v-slot:default="{ active }">
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="item.nome"
                                ></v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-action>
                                <v-checkbox
                                  :input-value="(active = true)"
                                  color="#009263"
                                ></v-checkbox>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </template>
                      </v-list-item-group> -->
                    </v-list>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text>
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text>
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="5">
          <v-text-field
            color="#009263"
            outlined
            readonly
            type="number"
            label="Tentativas"
            v-model="tentativas"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-text-field
            outlined
            color="#009263"
            label="Data Limite"
            prepend-icon="mdi-calendar"
            readonly
            v-model="date"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-text-field
            outlined
            color="#009263"
            v-model="time"
            label="Hora Limite"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
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
            height="520px"
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
                              >{{ index + 1 }})</v-img
                            >
                          </v-col>
                        </v-row>
                      </v-container>
                      <div
                        class="resposta mt-8 text-start"
                        v-else-if="tipoQuestao === 1"
                      >
                        <div class="input">
                          <span> Resposta Aberta </span>
                          <span class="unidade" v-html="unidade"></span>
                        </div>
                      </div>
                      <v-container v-else>
                        <ul>
                          <li v-for="(resp, index) in respostas" :key="index">
                            <b> Opção {{ index + 1 }}: </b>
                            <span v-html="resp"></span>
                          </li>
                        </ul>
                      </v-container>
                    </div>
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
      <v-row>
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
              @click="deleteTpc"
              rounded
              large
              class="white--text"
              color="#009263"
            >
              <v-icon large>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-container>
        </v-col>
      </v-row></v-container
    >
  </v-card>
</template>

<script>
import axios from "axios";
const host = require("@/config/hosts").hostAPI;

export default {
  props: ["id"],
  created() {
    this.getUserId();
    this.getTpc();
    this.getTemas();
  },
  data() {
    return {
      dialogResol: false,

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
    resolucao() {
      if (!this.catalogoQuestoes[this.counter]) return "";
      let img = this.catalogoQuestoes[this.counter].resolucao;
      img = img ? `/imagens/propresolucao/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    time() {
      if (!this.tpc) return "";
      let time = this.tpc.dataFim.split("T")[1].replace(":00.000Z", "");
      return time;
    },
    date() {
      if (!this.tpc) return "";
      let date = this.tpc.dataFim.split("T")[0];
      return date;
    },
    tentativas() {
      if (!this.tpc) return "";
      return this.tpc.tentativas;
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

    // Eliminar TPC
    async deleteTpc() {
      try {
        const verify = confirm("Eliminar TPC?");
        if (verify) {
          await axios.delete(host + "tpcs/" + this.id);
          this.$router.replace("/dashboard");
        }
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
      this.catalogoRespostas[questao.cod] = respostas;
    },

    questaoSelected(q, ind) {
      this.counter = ind;
      this.showRespostas();
      this.getTema();
    },
    getUserId() {
      this.userId = this.$store.getters.getUserId;
    },
    async getTpc() {
      try {
        const tpcData = await axios.get(host + "tpcs/" + this.id);

        this.tpc = tpcData.data;
        const questoesCod = tpcData.data["tpc_questoes"];
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
