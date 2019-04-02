import Vue from "vue";
import Router from "vue-router";
import Ranges from "./components/Ranges";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      alias: "/ranges",
      name: "ranges",
      component: Ranges
    }
  ]
});
