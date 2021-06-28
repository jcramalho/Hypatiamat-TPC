<template>
  <v-app id="app" :key="viewKey">
    <AuthApp @refreshLogout="refreshLogout" v-if="isLoggedIn" />
    <UserAuth v-else />
  </v-app>
</template>

<script>
import UserAuth from "@/views/UserAuth.vue";
import AuthApp from "@/views/AuthApp.vue";
const CrossStorageHub = require("cross-storage").CrossStorageHub;
const CrossStorageClient = require("cross-storage").CrossStorageClient;

export default {
  name: "App",
  components: { UserAuth, AuthApp },

  async created() {
    try {
      // Iniciar Hub
      CrossStorageHub.init([
        {
          origin: /localhost:8080$/,
          allow: ["get", "set", "del", "clear"],
        },
        // { origin: /hypatiamat.com$/, allow: ["get", "set", "del", "clear"] },
      ]);

      const token = localStorage.getItem("token");

      if (token) {
        this.$store.dispatch("tryLogin");
      } else {
        // Iniciar Client
        var storage = new CrossStorageClient("http://localhost:8081", {
          timeout: 5000,
        });

        await storage.onConnect();

        storage
          .get("token")
          .then((tok) => {
            if (tok) this.$store.dispatch("tryLogin", { token: tok });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } catch (e) {
      const error = new Error(e.message);
      throw error;
    }
  },
  data() {
    return {
      viewKey: 0,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  methods: {
    refreshLogout: function() {
      this.viewKey++;
    },
  },
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
