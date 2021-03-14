<template>
  <v-card class="pa-5">
    <v-container>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
          <v-card-title primary-title class="justify-center green--text">
            <h2>
              Criar Novo TPC
            </h2>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
          <v-text-field
            color="green"
            outlined
            type="text"
            label="Nome do TPC"
            class="mb-n6"
            required
          ></v-text-field>
        </v-col>
        <v-col class="text-end" cols="12" xs="12" sm="12" md="12" lg="6" xl="6">
          <v-btn large>
            Config
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-n6">
        <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="12">
          <v-combobox
            color="green"
            v-model="turmasSelected"
            :items="turmasProf"
            chips
            clearable
            multiple
            outlined
            full-width
            prefix="Turmas"
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                dark
                color="green"
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(item)"
              >
                <strong>{{ item }}</strong
                >&nbsp;
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="5">
          <v-text-field
            color="green"
            outlined
            v-model="tentativas"
            type="number"
            label="Tentativas"
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                color="green"
                v-model="date"
                label="Data Limite"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              color="green"
              v-model="date"
              scrollable
              locale="pt-PT"
            >
              <v-spacer></v-spacer>
              <v-btn text color="green" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="green" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="3" xl="5">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                color="green"
                v-model="date"
                label="Data Limite"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              color="green"
              v-model="date"
              scrollable
              locale="pt-PT"
            >
              <v-spacer></v-spacer>
              <v-btn text color="green" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="green" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
          <v-sheet>
            <v-slide-group v-model="questao" show-arrows center-active>
              <v-slide-item v-for="n in 4" :key="n" v-slot="{ active, toggle }">
                <v-chip
                  large
                  close
                  dark
                  color="green"
                  class="mx-2"
                  :input-value="active"
                  active-class="green black--text"
                  @click="toggle"
                >
                  Options {{ n }}
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-select
            outlined
            flat
            v-model="temaSelected"
            :items="temas"
            label="Temas"
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="12" lg="6" xl="5">
          <v-select
            v-model="subtemaSelected"
            outlined
            flat
            :items="subtemas"
            label="Subtemas"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="5">
          <v-card
            class="mt-n5 mx-auto"
            color="white"
            elevation="2"
            outlined
            rounded
          >
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" lg="10" xl="5">
                <p>
                  {{ questoesSelected[0] }}
                </p>
                <v-btn>Resoluçao</v-btn>
              </v-col>
              <v-col
                class="text-end"
                cols="12"
                xs="12"
                sm="12"
                md="12"
                lg="2"
                xl="5"
              >
                <p>
                  cenass2
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container>
            <v-btn>Voltar</v-btn>
          </v-container>
        </v-col>
        <v-col cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container class="text-center">
            <v-btn icon color="green">
              <v-icon> mdi-arrow-left-bold-circle </v-icon>
            </v-btn>
            <v-btn>adicionar</v-btn>

            <v-btn icon color="green">
              <v-icon> mdi-arrow-right-bold-circle </v-icon>
            </v-btn>
            <p class="mt-2">68/69</p>
          </v-container>
        </v-col>
        <v-col class="text-right" cols="12" xs="4" sm="4" md="4" lg="4" xl="5">
          <v-container>
            <v-btn>Criar</v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getUserId();
    this.getTurmas();
    this.getTemas();
    this.getQuestoes();
  },
  data() {
    return {
      userId: null,
      turmasProf: [],
      turmasSelected: [],
      tentativas: 1,
      date: null,
      modal: false,
      questao: null,
      temas: [],
      subtemas: [],
      temaSelected: null,
      subtemaSelected: null,
      catalogoTemas: [],
      catalogoQuestoes: [],
      questoesSelected: [],
      codTemaSelected: null,
    };
  },
  methods: {
    async getTemas() {
      const url = "http://localhost:1337";

      try {
        const response = await axios.get(url + "/temas");

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
        const error = new Error(err.message || "Failed to query Turmas");
        throw error;
      }
    },
    remove(item) {
      this.turmasSelected.splice(this.turmasSelected.indexOf(item), 1);
      this.turmasSelected = [...this.turmasSelected];
    },
    getUserId() {
      this.userId = this.$store.getters.getUserId;
    },
    async getTurmas() {
      const url = "http://localhost:1337";

      try {
        const response = await axios.get(url + "/turmas/prof/" + this.userId);
        this.turmasProf = response.data.map((t) => t.turma);
      } catch (err) {
        const error = new Error(err.message || "Failed to query Turmas");
        throw error;
      }
    },
    async getQuestoes() {
      const url = "http://localhost:1337";

      try {
        const response = await axios.get(url + "/exercicios?_limit=-1");
        this.catalogoQuestoes = response.data;
      } catch (err) {
        const error = new Error(err.message || "Failed to query Turmas");
        throw error;
      }
    },
  },
  watch: {
    temaSelected(now) {
      const codTema = this.catalogoTemas.filter((el) =>
        el.tema.includes(now)
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
    subtemaSelected(now) {
      let listSubtemas = this.catalogoTemas.filter((el) => {
        return el.codtema === this.codTemaSelected;
      })[0].subtemas;

      let codSubtema = listSubtemas.filter((el) => {
        return el.subtema === now;
      })[0].codsubtema;

      this.questoesSelected = this.catalogoQuestoes[codSubtema] || [
        "Não existem dados",
      ];
    },
  },
};
</script>

<style></style>
