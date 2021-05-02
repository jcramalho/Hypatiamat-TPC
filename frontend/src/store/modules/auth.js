const axios = require("axios");
const url = require("@/config/hosts").hostAPI;
let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
      userType: null,
    };
  },
  mutations: {
    setLoggedUser(state, payload) {
      state.userId = payload.userId;
      state.token = payload.token;
      state.userType = payload.userType;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async auth(context, payload) {
      try {
        const response = await axios.post(url + "auth/local", {
          identifier: payload.username,
          password: payload.password,
        });

        // Expiration time
        const expiresIn = response.data.token.expiresIn * 1000;

        const expirationDate = new Date().getTime() + expiresIn;

        // Browser Storage
        let userId;
        if (response.data.user.type === "aluno") {
          localStorage.setItem("userId", response.data.user.user);
          userId = response.data.user.user;
        } else {
          localStorage.setItem("userId", response.data.user.codigo);
          userId = response.data.user.codigo;
        }
        localStorage.setItem("userType", response.data.user.type);
        localStorage.setItem("token", response.data.token.jwt);
        localStorage.setItem("tokenExpiration", expirationDate);

        // Expiration timer
        timer = setTimeout(function() {
          context.dispatch("autoLogout");
        }, expiresIn);

        // Store Storage
        context.commit("setLoggedUser", {
          userId,
          token: response.data.token.jwt,
          userType: response.data.user.type,
        });
      } catch (err) {
        const error = new Error(
          err.message || "Failed to authenticate. Check your login data."
        );
        throw error;
      }
    },
    tryLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      // Expiration timer
      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function() {
        context.dispatch("autoLogout");
      }, expiresIn);

      if (token && userId) {
        context.commit("setLoggedUser", {
          token: token,
          userId: userId,
          userType: userType,
        });
      }
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");
      localStorage.removeItem("tokenExpiration");

      clearTimeout(timer);

      context.commit("setLoggedUser", {
        userId: null,
        token: null,
        userType: null,
      });
    },
    autoLogout(context) {
      context.dispatch("logout");
      context.commit("setAutoLogout");
    },
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getToken(state) {
      return state.token;
    },
    getUserType(state) {
      return state.userType;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};
