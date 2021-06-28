const axios = require("axios");
const host = require("@/config/hosts").hostAPI;
const Swal = require("sweetalert2");
const CrossStorageClient = require("cross-storage").CrossStorageClient;
import jwt_decode from "jwt-decode";

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
      // auth header axios
      if (payload.token)
        axios.defaults.headers.common = {
          Authorization: `Bearer ${payload.token}`,
        };
      else delete axios.defaults.headers.common["Authorization"];

      // atualizar store
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
        const response = await axios.post(host + "auth/local", {
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
        context.dispatch("getTpcs");
      } catch (err) {
        const error = new Error(
          err.message || "Failed to authenticate. Check your login data."
        );
        throw error;
      }
    },
    tryLogin(context, payload) {
      if (payload) {
        // token backoffice
        const token = payload.token;
        var decode_token = jwt_decode(token);
        console.log(decode_token);
        // verificar tipo user
        let userType = decode_token.user.type;
        let userId;
        if (userType === 10) {
          userId = decode_token.user.user;
          userType = "aluno";
        } else {
          userId = decode_token.user.codigo;
          userType = "professor";
        }

        // miliseconds
        const expires = (decode_token.exp - decode_token.iat) * 1000;

        const tokenExpiration = new Date().getTime() + expires;

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

          context.commit("setEditFlag", {
            isEditing: false,
          });
          context.dispatch("getTpcs");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userType", userType);
        localStorage.setItem("tokenExpiration", tokenExpiration);
      } else {
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

          context.commit("setEditFlag", {
            isEditing: false,
          });
          context.dispatch("getTpcs");
        }
      }
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");

      sessionStorage.clear();

      clearTimeout(timer);

      context.commit("setLoggedUser", {
        userId: null,
        token: null,
        userType: null,
      });

      // remover storage do backoffice.hypatiamat
      var storage = new CrossStorageClient("http://localhost:8081", {
        timeout: 5000,
      });

      storage
        .onConnect()
        .then(function() {
          return storage.del("token", "type", "utilizador");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    autoLogout(context) {
      context.dispatch("logout");
      context.commit("setAutoLogout");
      Swal.fire({
        icon: "info",
        title: "A sua Sessão Expirou.",
        confirmButtonColor: "#009263",
      });
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
