import Vue from "vue";
import Router from "vue-router";
import RangesPanel from "./components/RangesPanel";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: { path: "/ranges" }
    },
    {
      path: "/ranges",
      component: RangesPanel
    }
  ]
});
