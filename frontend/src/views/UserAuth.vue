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
            color="#008a5d"
            label="Utilizador"
            prepend-icon="mdi-account-circle"
            v-model="username"
            :rules="rule"
          />
          <v-text-field
            color="#008a5d"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            v-model="password"
            :rules="rule"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ml-1" dark large color="#008a5d" @click="submitForm"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
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
        alert("Credencias invalidas!!");
        return;
      }
      try {
        await this.$store.dispatch("auth", {
          username: this.username,
          password: this.password,
        });

        this.$router.replace("/dashboard");
      } catch (err) {
        this.error = err.message || "Failed to authenticate, try later.";
        alert(this.error);
      }
    },
  },
};
</script>

<style></style>
