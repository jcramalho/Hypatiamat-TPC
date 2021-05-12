<template>
  <v-card class="pa-5">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
          <v-card-title class="justify-center green--text">
            <h1>
              Criar Novo TPC
            </h1>
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
            v-model="titulo"
            :rules="textRules"
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
            @click:clear="clearTurmas"
            color="#009263"
            item-color="#009263"
            v-model="turmasSelected"
            :items="Object.keys(turmasProf)"
            chips
            clearable
            multiple
            outlined
            full-width
            prefix="Turmas"
          >
            <template v-slot:selection="{ item }">
              <v-dialog
                content-class="elevation-0"
                :retain-focus="false"
                v-model="turmaDialog"
                scrollable
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    dark
                    color="#009263"
                    v-bind="attrs"
                    v-on="on"
                    close
                    @click="editarAlunos(item)"
                    @click:close="removeTurma(item)"
                  >
                    <strong v-if="allAlunosFlag[item] === false"
                      >{{ item }}*</strong
                    >
                    <strong v-else>{{ item }}</strong>
                  </v-chip>
                </template>
                <v-card>
                  <v-card-title
                    style="background-color: #009263;"
                    class="white--text"
                  >
                    <b>Turma {{ turmaCod }}</b>
                  </v-card-title>

                  <v-card-text style="height: 300px;">
                    <v-list shaped>
                      <v-list-item-group multiple>
                        <div
                          class="mr-2"
                          style="display: flex; justify-content: flex-end"
                        >
                          <v-checkbox
                            @change="changeAll(turmaCod)"
                            :input-value="allAlunosFlag[turmaCod]"
                            color="#009263"
                          ></v-checkbox>
                        </div>
                        <v-divider></v-divider>
                        <template v-for="(al, ind) in turmasProf[turmaCod]">
                          <v-list-item
                            :key="ind"
                            :value="al"
                            active-class="#009263"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ al.nome }}</v-list-item-title
                              >
                            </v-list-item-content>

                            <v-list-item-action>
                              <v-checkbox
                                @change="changeActive(al)"
                                :input-value="al.active"
                                color="#009263"
                              ></v-checkbox>
                            </v-list-item-action>
                          </v-list-item>
                        </template>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      :style="{
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }"
                      color="#009263"
                      text
                      @click="turmaDialog = false"
                    >
                      Guardar
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
            v-model="tentativas"
            type="number"
            label="Tentativas"
            :rules="tentativasRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-dialog
            ref="dialog"
            v-model="dateModal"
            :return-value.sync="date"
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                color="#009263"
                v-model="date"
                label="Data Limite"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="textRules"
              ></v-text-field>
            </template>
            <v-date-picker
              color="#009263"
              v-model="date"
              scrollable
              locale="pt-PT"
              :min="new Date().toISOString().substr(0, 10)"
            >
              <v-spacer></v-spacer>
              <v-btn text color="#009263" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-dialog
            ref="dialog2"
            v-model="timeModal"
            :return-value.sync="time"
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                color="#009263"
                v-model="time"
                label="Hora Limite"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="textRules"
              ></v-text-field>
            </template>
            <v-time-picker
              scrollable
              color="#009263"
              format="24hr"
              v-model="time"
              full-width
            >
              <v-spacer></v-spacer>
              <v-btn text color="#009263" @click="$refs.dialog2.save(time)">
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" xs="12" sm="12" md="12" lg="11" xl="5">
          <v-sheet>
            <v-slide-group mandatory show-arrows center-active>
              <v-slide-item
                v-for="(q, index) in questoes"
                :key="index"
                v-slot="{ active, toggle }"
              >
                <v-chip
                  ref="chips"
                  large
                  close
                  dark
                  :color="corChip(q)"
                  class="mx-2"
                  :input-value="active"
                  active-class="black--text"
                  @click="toggle"
                  v-on:click="questaoSelected(q, index)"
                  @click:close="removeQuestao(index)"
                >
                  <span v-if="!q.cod"><i>Adicionar!</i></span>
                  <span v-else>{{ q.cod }}</span>
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
        <v-col class="text-end" cols="12" xs="12" sm="12" md="12" lg="1" xl="5">
          <v-btn
            @click="novaQuestao"
            rounded
            class="white--text"
            color="#009263"
          >
            <v-icon> mdi-plus-circle </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-combobox
            color="#009263"
            item-color="green"
            outlined
            flat
            v-model="temaSelected"
            :items="temas"
            label="Temas"
            @change="changeTema"
          ></v-combobox>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-combobox
            color="#009263"
            item-color="green"
            v-model="subtemaSelected"
            outlined
            flat
            :items="subtemas"
            label="Subtemas"
            @change="changeSubtema()"
          ></v-combobox>
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
                    <div v-if="hasQuestao === -1" class="mt-5 ml-5">
                      <h3>
                        Selecione um Tema e Subtema para visualizar as
                        respetivas Questões!
                      </h3>
                    </div>
                    <div v-else-if="hasQuestao === 0" class="mt-5 ml-5">
                      <h3>
                        O Tema/Subtema selecionado não possui questões
                        disponíveis.
                      </h3>
                    </div>
                    <div v-else-if="hasQuestaoConfig === 0" class="mt-5 ml-5">
                      <h3>
                        Não existem questões disponíveis para as configurações
                        de exame/nível de dificuldade escolhidas.
                      </h3>
                    </div>
                    <div v-else v-html="questaoAtual" class="mt-5 ml-10"></div>

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
                              ><b>{{ index + 1 }})</b></v-img
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
                            <b> {{ index + 1 }}) </b>
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
                      <v-dialog v-model="dialog" width="600px">
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
                            :disabled="!hasResolucao"
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
                              @click="dialog = false"
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
                <div id="container" v-if="hasQuestao !== 1"></div>
                <div id="container" v-else>
                  <div class="codquestao">
                    <span>
                      <b> {{ codQuestao }}</b>
                    </span>
                  </div>

                  <div class="selectExame">
                    <v-checkbox
                      @change="changeNivelExames"
                      v-model="onlyExames"
                      color="#009263"
                      dense
                      label="Exame"
                      ><span slot="label" class="black--text"
                        >Exame</span
                      ></v-checkbox
                    >
                  </div>

                  <div class="selectNivel">
                    <v-select
                      @change="changeNivelExames"
                      v-model="nivelSelect"
                      :items="nivelItems"
                      single-line
                      color="#009263"
                      item-color="green"
                      prefix="Nível"
                      dense
                    ></v-select>
                  </div>
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
            <v-btn large class="white--text" color="#009263" @click="voltar"
              >Voltar</v-btn
            >
          </v-container>
        </v-col>
        <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container class="text-center">
            <v-btn large icon color="#009263" @click="proxQuestao(false)">
              <v-icon large>
                mdi-arrow-left-bold-circle
              </v-icon>
            </v-btn>
            <v-btn
              @click="submitQuestao"
              class="mx-1"
              dark
              large
              color="#009263"
              >Adicionar</v-btn
            >

            <v-btn large icon color="#009263" @click="proxQuestao(true)">
              <v-icon large>
                mdi-arrow-right-bold-circle
              </v-icon>
            </v-btn>
            <p v-if="questoesSelected.length !== 0" class="mt-2">
              {{ contador }}
            </p>
          </v-container>
        </v-col>
        <v-col class="text-right" cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container>
            <v-btn large class="white--text" color="#009263" @click="criarTpc"
              >Criar TPC</v-btn
            >
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
const axios = require("axios");
const Swal = require("sweetalert2");
const host = require("@/config/hosts").hostAPI;

export default {
  created() {
    this.getUserId();
    this.getTurmas();
    this.getTemas();
    this.getQuestoes();
  },
  data() {
    return {
      nivelSelect: "*",
      nivelItems: ["*", 1, 2, 3, 4],
      onlyExames: false,
      userId: null,
      titulo: null,
      dialog: false,
      turmaCod: "",
      turmaDialog: false,
      turmasProf: [],
      turmasSelected: [],
      allAlunosFlag: {},
      tentativas: 1,
      date: null,
      time: null,
      dateModal: false,
      timeModal: false,
      questoes: [{}],
      chipAtivoIdx: 0,
      temas: [],
      subtemas: [],
      temaSelected: null,
      subtemaSelected: null,
      catalogoTemas: [],
      catalogoQuestoes: [],
      questoesSelected: [],
      codTemaSelected: null,
      counter: 0,
      respostas: [],
      hasQuestao: -1,
      hasQuestaoConfig: -1,
      tentativasRules: [(v) => v && v > 0],
      textRules: [(v) => !!v],
    };
  },
  computed: {
    exame() {
      if (!this.questoesSelected[this.counter]) return "";
      return this.questoesSelected[this.counter].idexame;
    },
    temExame() {
      if (
        this.questoesSelected[this.counter] &&
        this.questoesSelected[this.counter].idexame
      )
        return 1;
      return 0;
    },
    nivel() {
      if (!this.questoesSelected[this.counter]) return "";
      return this.questoesSelected[this.counter].niveldificuldade;
    },
    codQuestao() {
      if (!this.questoesSelected[this.counter]) return "";
      return this.questoesSelected[this.counter].cod;
    },
    unidade() {
      if (!this.questoesSelected[this.counter]) return "";
      return this.questoesSelected[this.counter].unidade;
    },
    hasResolucao() {
      if (!this.questoesSelected[this.counter]) return false;
      return true;
    },
    resolucao() {
      if (!this.questoesSelected[this.counter]) return "";
      let img = this.questoesSelected[this.counter].resolucao;
      img = img ? `/imagens/propresolucao/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    imagem() {
      if (!this.questoesSelected[this.counter]) return "";
      let img = this.questoesSelected[this.counter].figura;
      img = img ? `/imagens/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    contador() {
      return `${this.counter + 1}/${this.questoesSelected.length}`;
    },
    questaoAtual() {
      if (!this.questoesSelected[this.counter]) return "";

      return this.questoesSelected[this.counter].questao;
    },
    tipoQuestao() {
      if (!this.questoesSelected[this.counter]) return 0;

      return this.questoesSelected[this.counter].tipo;
    },
  },
  methods: {
    changeNivelExames() {
      let listSubtemas = this.catalogoTemas.filter((el) => {
        return el.codtema === this.codTemaSelected;
      })[0].subtemas;

      let codSubtema = listSubtemas.filter((el) => {
        return el.subtema === this.subtemaSelected;
      })[0].codsubtema;

      this.questoesSelected = this.catalogoQuestoes[codSubtema] || [];

      // Só exames
      if (this.onlyExames)
        this.questoesSelected = this.questoesSelected.filter(
          (el) => el.idexame !== ""
        );

      // Só nivel x
      switch (this.nivelSelect) {
        case "*":
          break;
        default:
          this.questoesSelected = this.questoesSelected.filter(
            (el) => el.niveldificuldade === this.nivelSelect
          );
          break;
      }

      if (this.questoesSelected.length === 0) {
        this.hasQuestaoConfig = 0;
      } else this.hasQuestaoConfig = 1;

      this.counter = 0;
      this.getRespostas();
    },
    clearTurmas() {
      this.turmasSelected.forEach((el) => this.resetAllTrue(el));
      this.turmasSelected = [];
    },
    resetAllTrue(turma) {
      this.allAlunosFlag[turma] = true;
      this.turmasProf[turma].map((el) => (el.active = true));
    },
    changeAll(turma) {
      this.allAlunosFlag[turma] = !this.allAlunosFlag[turma];
      this.turmasProf[turma].map(
        (el) => (el.active = this.allAlunosFlag[turma])
      );
    },
    changeActive(aluno) {
      aluno.active = !aluno.active;

      if (
        this.turmasProf[this.turmaCod].filter((e) => e.active === false)
          .length === 0
      ) {
        this.allAlunosFlag[this.turmaCod] = true;
      } else {
        this.allAlunosFlag[this.turmaCod] = false;
      }
    },

    editarAlunos(turma) {
      this.turmaCod = turma;
    },
    async criarTpc() {
      try {
        // Verificar inputs
        if (
          !this.titulo ||
          this.tentativas < 1 ||
          !this.date ||
          !this.time ||
          this.turmasSelected.length == 0
        ) {
          return Swal.fire({
            icon: "error",
            title: "Existem campos por preencher!",
            confirmButtonColor: "#009263",
          });
        }

        if (this.questoes.find((el) => Object.keys(el).length === 0))
          return Swal.fire({
            icon: "error",
            title: "Existem questões por adicionar na lista!",
            confirmButtonColor: "#009263",
          });

        Swal.fire({
          title: "Criar TPC?",
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
              title: "A criar TPC...",
              showConfirmButton: false,
              allowOutsideClick: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            const questoesCod = this.questoes.map((el) => el.cod);
            const questoesId = [];
            for (const codQuestao of questoesCod) {
              const response = await axios.post(host + "tpc-questoes", {
                codQuestao,
              });
              questoesId.push(response.data.id);
            }

            const alunosId = [];
            for (const turma of this.turmasSelected) {
              const alunos = this.turmasProf[turma];
              for (const al of alunos) {
                if (al.active) {
                  const response = await axios.post(host + "tpc-alunos", {
                    nome: al.nome,
                    codAluno: al.user,
                    codTurma: turma,
                  });
                  alunosId.push(response.data.id);
                }
              }
            }

            let body = {
              tagname: this.titulo,
              codProf: this.userId,
              tentativas: this.tentativas,
              ativo: 1,
              dataInicio: new Date(),
              dataFim: new Date(`${this.date} ${this.time}`),
              tpc_questoes: questoesId,
              tpc_alunos: alunosId,
            };

            await axios.post(host + "tpcs", body);

            Swal.close();
            Swal.fire({
              icon: "success",
              title: "TPC criado com sucesso!",
              confirmButtonColor: "#009263",
            });
            this.$router.replace("/dashboard");
          }
        });
      } catch (err) {
        const error = new Error(err.message || "Failed to post TPC");
        throw error;
      }
    },
    imgRespostas(img) {
      img = img ? `/imagens/${img.replace(".swf", "")}.png` : "";
      return img;
    },
    corChip(questao) {
      if (!questao.cod) return "green";
      return "#009263";
    },
    submitQuestao() {
      if (!this.questoesSelected[this.counter]) return;
      if (
        this.questoes.find(
          (x) => x.cod === this.questoesSelected[this.counter].cod
        )
      )
        return Swal.fire({
          title: "Já selecionou esta questão!",
          icon: "warning",
          confirmButtonColor: "#009263",
        });
      const chipIndex = this.chipAtivoIdx;
      const questao = this.questoesSelected[this.counter];
      this.$set(this.questoes, chipIndex, questao);
    },
    questaoSelected(q, ind) {
      this.nivelSelect = "*";
      this.onlyExames = false;
      this.hasQuestaoConfig = -1;
      this.chipAtivoIdx = ind;
      if (!q.cod) return;

      this.codTemaSelected = q.tema;

      const temaEntry = this.catalogoTemas.filter((el) => {
        return el.codtema === this.codTemaSelected;
      })[0];

      this.temaSelected = temaEntry.tema;

      this.changeTema();
      this.subtemaSelected = temaEntry.subtemas.filter((el) => {
        return el.codsubtema === q.subtema;
      })[0].subtema;
      this.changeSubtema(q);
    },
    changeTema() {
      this.nivelSelect = "*";
      this.onlyExames = false;
      this.hasQuestaoConfig = -1;
      this.hasQuestao = -1;
      this.respostas = [];
      this.questoesSelected = [];
      this.subtemaSelected = null;
      const codTema = this.catalogoTemas.filter((el) =>
        el.tema.includes(this.temaSelected)
      )[0].codtema;
      this.codTemaSelected = codTema;
      let subtemas = this.catalogoTemas.filter((el) => {
        return el.codtema === codTema;
      })[0].subtemas;

      this.subtemas = [];
      subtemas.forEach((el) => {
        this.subtemas.push(el.subtema);
      });
    },
    changeSubtema(questao) {
      this.nivelSelect = "*";
      this.onlyExames = false;
      this.hasQuestaoConfig = -1;
      this.hasQuestao = -1;
      if (this.subtemaSelected) {
        let listSubtemas = this.catalogoTemas.filter((el) => {
          return el.codtema === this.codTemaSelected;
        })[0].subtemas;

        let codSubtema = listSubtemas.filter((el) => {
          return el.subtema === this.subtemaSelected;
        })[0].codsubtema;

        this.questoesSelected = this.catalogoQuestoes[codSubtema] || [];

        if (this.questoesSelected.length === 0) this.hasQuestao = 0;
        else this.hasQuestao = 1;

        if (questao)
          this.counter = this.questoesSelected.findIndex(
            (el) => el === questao
          );
        else this.counter = 0;

        this.getRespostas();
      }
    },
    removeQuestao(ind) {
      if (this.questoes.length > 1) {
        if (this.chipAtivoIdx === this.questoes.length - 1) this.chipAtivoIdx--;
        this.questoes.splice(ind, 1);
        this.questoes = [...this.questoes];
      }
    },
    async novaQuestao() {
      const questao = {};
      await this.questoes.push(questao);
      let len = this.questoes.length - 1;
      this.$refs.chips[len].click();
    },
    getRespostas() {
      this.respostas = [];
      let questao = this.questoesSelected[this.counter];
      if (!questao) return "";
      switch (questao.tipo) {
        case 0:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          this.respostas.push(questao.resposta3);
          this.respostas.push(questao.resposta4);
          break;
        case 1:
          this.respostas.push(questao.unidade);
          break;
        case 2:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          this.respostas.push(questao.resposta3);
          this.respostas.push(questao.resposta4);
          break;
        case 3:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          break;
        case 4:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          this.respostas.push(questao.resposta3);
          break;
        case 5:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          this.respostas.push(questao.resposta3);
          this.respostas.push(questao.resposta4);
          this.respostas.push(questao.resposta5);
          break;
        case 6:
          this.respostas.push(questao.resposta1);
          this.respostas.push(questao.resposta2);
          this.respostas.push(questao.resposta3);
          this.respostas.push(questao.resposta4);
          this.respostas.push(questao.resposta5);
          this.respostas.push(questao.resposta6);
          break;
      }
    },
    proxQuestao(flag) {
      const nQuestoes = this.questoesSelected.length;
      if (flag) {
        if (this.counter + 1 < nQuestoes) this.counter++;
      } else {
        if (this.counter - 1 >= 0) this.counter--;
      }
      this.getRespostas();
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

          this.temas.push(tema);
        });
      } catch (err) {
        const error = new Error(err.message || "Failed to query Temas");
        throw error;
      }
    },
    removeTurma(item) {
      this.turmasSelected.splice(this.turmasSelected.indexOf(item), 1);
      this.turmasSelected = [...this.turmasSelected];
      this.resetAllTrue(item);
    },
    getUserId() {
      this.userId = this.$store.getters.getUserId;
    },
    async getTurmas() {
      try {
        const response = await axios.get(host + "turmas/prof/" + this.userId);

        let turmas = {};
        Object.entries(response.data).forEach(([turma, alunos]) => {
          const al = alunos.map(({ user, nome }) => ({
            user,
            nome,
            active: true,
          }));
          turmas[turma] = al;
          this.allAlunosFlag[turma] = true;
        });

        this.turmasProf = turmas;
      } catch (err) {
        const error = new Error(err.message || "Failed to query Turmas");
        throw error;
      }
    },
    async getQuestoes() {
      try {
        const response = await axios.get(host + "exercicios?_limit=-1");
        this.catalogoQuestoes = response.data;
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
.raiz {
  white-space: nowrap;
}
.raiz-content {
  text-decoration: overline;
}
sup {
  display: inline-block;
  text-decoration: none;
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

.resposta {
  width: 700px;
}

#container {
  height: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.codquestao {
  width: 100px;
  margin-left: 5px;
  margin-top: 5px;
}

.selectExame {
  width: 120px;
  margin-top: -14px;
}

.selectNivel {
  width: 80px;
  margin-top: -2px;
}

#exame {
  padding: 5px 10px;
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
