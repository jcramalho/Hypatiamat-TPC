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
const hostOffice = require("@/config/hosts").hostOffice;
const storageHosts = require("@/config/hosts").storageHosts;

export default {
  name: "App",
  components: { UserAuth, AuthApp },

  async created() {
    try {
      // Iniciar Hub
      CrossStorageHub.init(storageHosts);

      const token = localStorage.getItem("token");

      if (token) {
        this.$store.dispatch("tryLogin");
      } else {
        // Iniciar Client
        var storage = new CrossStorageClient(hostOffice, {
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
          })
          .then(() => {
            storage.close();
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
  watch: {},
};
</script>

<style></style>
