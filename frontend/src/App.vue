<template>
  <v-app id="app">
    <AuthApp v-if="isLoggedIn" />
    <UserAuth v-else />
  </v-app>
</template>

<script>
import UserAuth from "@/views/UserAuth.vue";
import AuthApp from "@/views/AuthApp.vue";

export default {
  name: "App",
  components: { UserAuth, AuthApp },

  created() {
    this.$store.dispatch("tryLogin");
  },
  data() {
    return {};
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  methods: {},
  watch: {
    // didAutoLogout(curValue, oldValue) {
    //   if (curValue && curValue !== oldValue) {
    //     this.$router.replace("/login");
    //   }
    // },
  },
};
</script>

<style></style>
