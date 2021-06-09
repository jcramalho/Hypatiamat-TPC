<template>
  <v-app id="inspire">
    <v-main class="grey lighten-3">
      <v-container>
        <v-card class="pa-5">
          <v-card-title class="justify-center green--text">
            <h2>Estatísticas Professor</h2>
          </v-card-title>
          <center>
            <v-btn v-if="!show" text @click="show = !show"
              ><span>Mostrar Ajuda</span
              ><v-icon color="#009263"> mdi-help-circle </v-icon>
            </v-btn>
            <v-btn v-else text @click="show = !show">Esconder Ajuda</v-btn>
          </center>
          <v-slide-y-transition>
            <v-card
              v-show="show"
              class="elevation-6 pa-3"
              style="border: 2px solid green !important;"
              color="grey lighten-3"
            >
              <v-row class="justify-center">
                <v-col cols="12">
                  <span>
                    1. No "Tipo de Ranking", pode escolher o critério de
                    ordenação que desejar.
                  </span>
                </v-col>
                <v-col cols="12">
                  <span>
                    2. Pode selecionar a turma desejada através da seleção do
                    campo "Turma".
                  </span>
                </v-col>
                <v-col cols="12">
                  <span>
                    3. Pode escolher a aplicação de conteúdo pretendida através
                    da seleção do campo "Aplicação". De referir que este campo
                    apenas contém as aplicações de conteúdo que a turma
                    selecionada realizou.
                  </span>
                </v-col>
                <v-col cols="12">
                  <span>
                    4. Pode escolher o ano letivo desejado através do campo "Ano
                    Letivo".
                  </span>
                </v-col>
                <v-col cols="12">
                  <span>
                    5. Tendo os campos todos selecionados, pode visualizar o
                    ranking dos seus alunos.
                  </span>
                </v-col>
                <v-col cols="9">
                  <v-card class="mx-auto" color="grey lighten-4">
                    <center>
                      <h3 class="green--text">Legenda da Tabela:</h3>
                    </center>
                    <ul>
                      <li>
                        <span> <b>N.º</b> - Número do aluno; </span>
                      </li>
                      <li>
                        <span>
                          <b>Posição (Turma)</b> - Posição do aluno na turma;
                        </span>
                      </li>
                      <li>
                        <span>
                          <b>Posição (Agr. Escolas)</b> - Posição do aluno no
                          seu Agrupamento de Escolas;
                        </span>
                      </li>
                      <li>
                        <span>
                          <b>Posição (Hypatia)</b> - Posição do aluno em todo o
                          Hypatiamat;
                        </span>
                      </li>
                      <li>
                        <span>
                          <b>NTRC</b> - Número de tarefas resolvidas
                          corretamente. Caso o nome da coluna esteja a verde,
                          significa que é o critério de ordenação selecionado;
                        </span>
                      </li>
                      <li>
                        <span>
                          <b>Acerto(%)</b> - Percentagem de acerto, ou seja, a
                          divisão do NTRC pelo número de tarefas resolvidas.
                          Caso o nome da coluna esteja a verde, significa que é
                          o critério de ordenação selecionado.
                        </span>
                      </li>
                    </ul>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-slide-y-transition>
          <br />
          <center>
            <v-btn class="white--text" style="background-color: #009263;">
              <v-icon> mdi-pdf-box </v-icon> Exportar
            </v-btn>
          </center>
          <center>
            <v-container style="width:80%">
              <v-card class="pa-5">
                <v-combobox
                  v-model="anoSel"
                  label="Ano Letivo"
                  color="green"
                  :items="anos"
                  @change="changeAno"
                ></v-combobox>
                <v-combobox
                  v-model="turmaSel"
                  label="Turma"
                  color="green"
                  :items="turmas"
                  @change="changeTurma"
                ></v-combobox>
                <v-combobox
                  v-model="tpcSel"
                  label="TPCs"
                  color="green"
                  :items="tpcs"
                  @change="changeTpc"
                ></v-combobox>
              </v-card>
            </v-container>
          </center>
          <br />
          <v-container v-if="loading">
            <center>
              <v-img
                :src="require('@/assets/loading.gif')"
                width="150px"
                heigth="150px"
              >
              </v-img>
            </center>
          </v-container>
          <v-container v-else>
            <v-text-field
              v-model="filtro"
              label="Filtrar"
              prepend-icon="mdi-magnify"
              color="#009263"
              single-line
            ></v-text-field>
            <v-data-table
              no-data-text="Não existem Dados"
              :footer-props="{
                'items-per-page-text': 'Mostrar',
                'items-per-page-options': [30, 60, -1],
                'items-per-page-all-text': 'Todos',
              }"
              dense
              :headers="headers"
              :items="results"
              class="elevation-1"
              :search="filtro"
              color="#009263"
            >
            </v-data-table>
          </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {},
  data() {
    return {
      results: [],
      filtro: "",
      anos: [],
      turmas: [],
      tpcs: [],
      anoSel: null,
      turmaSel: null,
      tpcSel: null,
      loading: false,
      show: false,
      headers: [
        { text: "Nº", value: "numero", class: "subtitle-1" },
        { text: "Nome", value: "nome", class: "subtitle-1" },
        { text: "TPCs", value: "posHypatia", class: "subtitle-1" },
        { text: "NQRC", value: "total", class: "subtitle-1" },
        { text: "Acerto (%)", value: "params", class: "subtitle-1" },
      ],
    };
  },
  computed: {},
  methods: {
    changeAno() {},
    changeTurma() {},
    changeTpc() {},
  },
};
</script>

<style></style>
