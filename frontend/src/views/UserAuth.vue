<template>
  <div>
    <!-- <v-card width="600" class="mx-auto mt-5"> </v-card> -->
    <v-card width="600" class="mx-auto mt-2">
      <v-card-title class="">
        <h1 style="color:#008a5d">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-on:keyup.enter="submitForm"
            color="#009263"
            label="Utilizador"
            prepend-icon="mdi-account-circle"
            v-model="username"
            :rules="rule"
          />
          <v-text-field
            v-on:keyup.enter="submitForm"
            color="#009263"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            v-model="password"
            :rules="rule"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ml-1" dark large color="#009263" @click="submitForm"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
const Swal = require("sweetalert2");

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      error: null,
      rule: [(val) => (val || "").length > 0 || "Campo obrigatório!"],
    };
  },
  methods: {
    async submitForm() {
      if (!this.username || !this.password) {
        Swal.fire({
          icon: "error",
          confirmButtonColor: "#009263",
          title: "Não preencheu os dois campos!",
          width: 450,
        });
        return;
      }
      try {
        await this.$store.dispatch("auth", {
          username: this.username,
          password: this.password,
        });

        Swal.fire({
          icon: "success",
          confirmButtonColor: "#009263",
          title: "Login efetuado com sucesso.",
          width: 450,
        });
        this.$router.replace("/dashboard");
      } catch (err) {
        Swal.fire({
          icon: "error",
          confirmButtonColor: "#009263",
          title: "Credenciais erradas!",
          width: 450,
        });
      }
    },
  },
};
</script>

<style></style>
