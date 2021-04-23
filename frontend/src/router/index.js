import Vue from "vue";
import VueRouter from "vue-router";
import UserAuth from "../views/UserAuth.vue";
import TheDashboard from "../views/TheDashboard.vue";
import CreateTpc from "../views/CreateTpc.vue";
import TheHistoric from "../views/TheHistoric.vue";
import TheStats from "../views/TheStats.vue";
import DoTpc from "../views/DoTpc.vue";
import TheResults from "../views/TheResults.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "UserAuth",
    component: UserAuth,
  },
  {
    path: "/dashboard",
    name: "TheDashboard",
    component: TheDashboard,
  },
  {
    path: "/create",
    name: "CreateTpc",
    component: CreateTpc,
  },
  {
    path: "/tpc/:id",
    name: "DoTpc",
    component: DoTpc,
    props: true,
  },
  {
    path: "/resultados/:id",
    name: "TheResults",
    component: TheResults,
    props: true,
  },
  {
    path: "/historic",
    name: "TheHistoric",
    component: TheHistoric,
  },
  {
    path: "/stats",
    name: "TheStats",
    component: TheStats,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;