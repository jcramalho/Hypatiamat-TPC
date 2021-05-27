import Vue from "vue";
import VueRouter from "vue-router";
import TheDashboard from "../views/TheDashboard.vue";
import CreateTpc from "../views/CreateTpc.vue";
import TheHistoric from "../views/TheHistoric.vue";
import TheStats from "../views/TheStats.vue";
import DoTpc from "../views/DoTpc.vue";
import TheResults from "../views/TheResults.vue";
import SeeTPC from "../views/SeeTPC.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/dashboard" },
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
    path: "/ver-tpc/:id",
    name: "SeeTPC",
    component: SeeTPC,
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
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
