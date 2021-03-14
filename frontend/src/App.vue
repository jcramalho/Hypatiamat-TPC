<template>
  <v-app>
    <v-app-bar app clipped-left color="#0c2a25" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Hypatiamat"
          class="shrink mr-2"
          contain
          src="./assets/logo6.png"
          transition="scale-transition"
          width="150"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn class="mr-2" outlined v-if="isLoggedIn" @click="logout">
        <span>Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
    <!-- 
    <v-footer app padless dark>
      <v-card flat tile width="100%" color="#0c2a25" class="text-center">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon.icon"
            class="mx-4"
            icon
            :href="icon.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-icon color="white" size="24px">
              {{ icon.icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <v-btn
            class="pa-0 white--text"
            small
            text
            href="https://www.hypatiamat.com/"
            target="_blank"
            rel="noopener noreferrer"
            >Hypatiamat</v-btn
          >
        </v-card-text>
      </v-card>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.dispatch("tryLogin");
  },
  components: {},
  data() {
    return {
      icons: [
        {
          icon: "mdi-facebook",
          link: "https://www.facebook.com/hypatiamat",
        },
        {
          icon: "mdi-youtube",
          link: "https://www.youtube.com/channel/UCk3CN9sYSXY60jtaIQreMzw",
        },
        {
          icon: "mdi-instagram",
          link: "https://www.instagram.com/hypatiamate/",
        },
      ],
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
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    },
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace("/login");
      }
    },
  },
};
</script>

<style></style>
